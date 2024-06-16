import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "../context/AuthContext";
import { useToastr } from "./useToastr";

export const useGameInviter = () => {
    const { currentUser } = useAuthContext();
    const [invitePending, setInvitePending] = useState<boolean>(false);
    const [gameInviteId, setGameInviteId] = useState<string>("");

    useEffect(() => {
        const invitePendingData = window.localStorage.getItem('invitePending');
        const gameInviteIdData = window.localStorage.getItem('gameInviteId');
        invitePendingData !== null && setInvitePending(JSON.parse(invitePendingData));
        gameInviteIdData !== null && setGameInviteId(JSON.parse(gameInviteIdData));
    },[]);
       
    useEffect(() => {
        window.localStorage.setItem('invitePending', JSON.stringify(invitePending));
        window.localStorage.setItem('gameInviteId', JSON.stringify(gameInviteId));
    },[invitePending, gameInviteId]);

    const invitePlayer = async (otherUserId: string) => {
        if (!invitePending) { 
            try {        
              const userSnap = await getDoc(doc(db, 'presence', otherUserId));    
              if (userSnap.exists() && !userSnap.data().online) {
                useToastr("Can't invite an offline user!", "error");
                return;
              }  
              await setDoc(doc(db, "gameInvitations", otherUserId + currentUser?.uid),{
                id: otherUserId + currentUser?.uid,
                userId: otherUserId,
                senderId : currentUser?.uid,
                senderDisplayName : currentUser?.displayName,
                link: `${import.meta.env.VITE_BLACK_GAME_LINK}${otherUserId + currentUser?.uid}`,
                gameConcluded: false,
                gameAccepted: ""
              });   
              useToastr("Your invitation was successfully sent!", "success");
              setInvitePending(true);
              setGameInviteId(otherUserId + currentUser?.uid);       
            }
            catch (err) {
              useToastr("There was a problem inviting this user to a match", 'error');
            }      
        } 
        else {
            useToastr("Can't invite more than one person at a time!", "error");
        }         
    }

    useEffect(() => {
        let unsub: Function;
        let timer: ReturnType<typeof setTimeout>;
    
        if (invitePending && gameInviteId !== "") {
          const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
          unsub = onSnapshot(gameInviteRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.gameAccepted === "true") { // user accepts game offer
              window.open(`${import.meta.env.VITE_WHITE_GAME_LINK}${gameInviteId}`, '_blank');
              resetState();
            } 
            else if (data && data.gameAccepted === "false") { // user declines game offer  
              useToastr("Your invitation was declined", "error");
              resetState();
            }
          });
    
          timer = setTimeout(async () => {
            try {
              const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
              const gameInviteSnap = await getDoc(gameInviteRef);
              if (gameInviteSnap.data()?.gameConcluded === false) { // user didn't respond to game offer after 10 seconds
                await updateDoc(gameInviteRef, { gameConcluded: true });
                useToastr("Your invitation was not responded to within the specified time frame", "error");
                resetState();
              }
            } 
            catch (_err) {
              useToastr("Your invitation was not responded to within the specified time frame", "error");
            }
          }, 10000);
        }
    
        return () => {
          if (unsub) unsub();
          clearTimeout(timer);
        };
    
    }, [invitePending, gameInviteId]);

    const resetState = () => {
        setInvitePending(false);
        setGameInviteId("");
    }

   return { invitePlayer };
}