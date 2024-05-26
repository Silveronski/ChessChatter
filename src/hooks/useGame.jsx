import useToastr from "./useToastr";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/AuthContext";

export const useGame = () => {
    const {currentUser} = useContext(AuthContext);
    const [invitePending, setInvitePending] = useState(false);
    const [gameInviteId, setGameInviteId] = useState("");

    useEffect(() => {
        const invitePendingData = window.localStorage.getItem('invitePending');
        const gameInviteIdData = window.localStorage.getItem('gameInviteId');
        if (invitePendingData !== null) setInvitePending(JSON.parse(invitePendingData));
        if (gameInviteIdData !== null) setGameInviteId(JSON.parse(gameInviteIdData));
    },[]);
       
    useEffect(() => {
        window.localStorage.setItem('invitePending', JSON.stringify(invitePending));
        window.localStorage.setItem('gameInviteId', JSON.stringify(gameInviteId));
    },[invitePending, gameInviteId]);

    const invitePlayer = async (otherUserId) => {
        if (!invitePending) { 
            try {        
              const userSnap = await getDoc(doc(db, 'presence', otherUserId));    
              if (userSnap.exists() && !userSnap.data().online) {
                useToastr("error", "Can't invite an offline user!");
                return;
              }  
              await setDoc(doc(db, "gameInvitations", otherUserId + currentUser.uid),{
                id: otherUserId + currentUser.uid,
                userId: otherUserId,
                senderId : currentUser.uid,
                senderDisplayName : currentUser.displayName,
                link: otherUserId + currentUser.uid,
                gameConcluded: false,
                gameAccepted: ""
              });   
              useToastr("success", "Your invitation was successfully sent!");
              setInvitePending(true);
              setGameInviteId(otherUserId + currentUser.uid);       
            }
            catch (err) {
              console.log(err);
              // handle error - problem setting doc
            }      
        } 
        else {
            useToastr("error", "Can't invite more than one person at a time!");
        }         
    }

    useEffect(() => {
        let unsub;
        let timer;
    
        if (invitePending && gameInviteId !== "") {
          const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
          unsub = onSnapshot(gameInviteRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data && data.gameAccepted === "true") { // user accepts game offer
              window.open(`https://chess-game-fh3hl.ondigitalocean.app/white?code=${gameInviteId}`, '_blank');
              resetState();
            } 
            else if (data && data.gameAccepted === "false") { // user declines game offer          
                useToastr("error", "Your invitation was declined");
                resetState();
            }
          });
    
          timer = setTimeout(async () => {
            try {
              const gameInviteRef = doc(db, "gameInvitations", gameInviteId);
              const gameInviteSnap = await getDoc(gameInviteRef);
              if (gameInviteSnap.data().gameConcluded === false) { // user didn't respond to game offer after 10 seconds
                await updateDoc(gameInviteRef, { gameConcluded: true });
                useToastr("error", "Your invitation was not responded to within the specified time frame");
                resetState();
              }
            } catch (err) {
              console.log(err);
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