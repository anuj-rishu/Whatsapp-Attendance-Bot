import MessageType from "../types/message"
import Chat from '../models/Chat';

const checkVerifed = async (message: MessageType) => {
    const foundchat = await Chat.findOne({ phone_number: message.payload.source })
    if(!foundchat){
        const createdChat = await Chat.create({
            phone_number: message.payload.payload.text
        })
        return {chat: createdChat, success: false}
    }
    else if (foundchat.isVerifed == false) {
        return { chat: foundchat, success: false };
    }
    else {
        return { chat: foundchat, success: true };
    }
}

export default checkVerifed