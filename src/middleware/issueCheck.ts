import { ChatDocument } from "../models/Chat";
import MessageType from "../types/message";
import SendMessage from '../utils/SendMessage';
import client from '../utils/redisConnection';

const issueCheck = async (chat: ChatDocument, message: MessageType) => {
    if(!chat.hasIssue){
        return {success: true}
    }
    else{
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `We have detected a Issue with your account\n\nPlease use */cp* command to change your password`})
        return {success: false}
    }
}

export default issueCheck