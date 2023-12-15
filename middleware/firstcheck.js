const Chat = require('../models/Chat')

const firstcheck = async (rclient, message) => {
    const foundchat = await Chat.findOne({ phone_number: message.payload.source });
    if (foundchat) {
        if (foundchat.isVerifed) {
            return { chat: foundchat, message: "Is verifed" }
        }
    }
    else{
        const createdchat = await Chat.create({
            phone_number: message.payload.source
        })
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        // client.sendMessage(message.from, 'Verify your Account to get started!\n(*Passwords are Encrypted*)\n\nType */verify {NetId} {Password}*\neg:\n*/verify vg6796 Abc@123*');
        return { chat: createdchat, message: "Chat created" };
    }
}

module.exports = firstcheck