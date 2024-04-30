import MessageType from "../../types/message";
import Chat from '../../models/Chat';
import SendMessage from '../../utils/SendMessage';
import client from '../../utils/redisConnection';

const firstcheck = async (message: MessageType) => {
    const foundchat = await Chat.findOne({ phone_number: message.payload.source });
    if (foundchat) {
        if (foundchat.isVerifed) {
            return { chat: foundchat, message: "Is verifed" }
        } else {
            return { chat: foundchat, message: "Chat found" };
        }
    } else{
        const createdchat = await Chat.create({
            phone_number: message.payload.source
        })
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `Verify your Account to get started!\n(*Passwords are Encrypted*)\n\nType */verify {NetId} {Password}*\neg:\n*/verify vg6796 Abc@123*`})
        return { chat: createdchat, message: "Chat created" };
    }
}

export default firstcheck