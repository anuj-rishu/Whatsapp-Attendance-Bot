const Chat = require('../models/Chat');
const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')

const firstcheck = async (message) => {
    const foundchat = await Chat.findOne({ phone_number: message.payload.source });
    if (foundchat) {
        if (foundchat.isVerifed) {
            return { chat: foundchat, message: "Is verifed" }
        }
        if (!foundchat.isVerifed){
            // Do nothing
            return { chat: foundchat, message: "Chat found" };
        }
    }
    else{
        const createdchat = await Chat.create({
            phone_number: message.payload.source
        })
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `Verify your Account to get started!\n(*Passwords are Encrypted*)\n\nType */verify {NetId} {Password}*\neg:\n*/verify vg6796 Abc@123*`})
        return { chat: createdchat, message: "Chat created" };
    }
}

module.exports = firstcheck