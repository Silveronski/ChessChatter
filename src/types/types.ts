type TMessage = {
    id: string,
    text: string,
    senderId: string,
    receiverId: string,
    date: string,
    fullDate: Date,
    img?: string
};

type TUserPresence = {
    name: string,
    online: boolean,
    hasShown: boolean,
    date: Date,
    count?: number
}