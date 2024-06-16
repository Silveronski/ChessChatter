import { Timestamp } from "firebase/firestore";

// DocumentData
export type TMessage = {
    id: string,
    text: string,
    senderId: string,
    receiverId: string,
    date: string,
    fullDate: Timestamp,
    img?: string
};

export type TUserPresence = {
    name: string,
    online: boolean,
    hasShown: boolean,
    date: Date,
    count?: number
}

export type TUserChat = {
    date: string,
    fullDate: Timestamp,
    lastMessage: {
        senderId: string,
        text: string,
    },
    userInfo: {
        displayName: string,
        photoURL: string,
        uid: string,
    }
}

export type TError = {
    msg?: string,
    activated: boolean
}