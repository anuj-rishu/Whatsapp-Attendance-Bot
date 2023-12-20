const Chat = require('../models/Chat');
const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

const firstcheck = async (value, message) => {
    const rclient = connection.Client;
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
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: message.payload.source, message: `Verify your Account to get started!\n(*Passwords are Encrypted*)\n\nType */verify {NetId} {Password}*\neg:\n*/verify vg6796 Abc@123*`})
        return { chat: createdchat, message: "Chat created" };
    }
}

module.exports = firstcheck