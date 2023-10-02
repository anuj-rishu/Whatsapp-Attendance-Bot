const Chat = require("../models/Chat")

const checkVerifed = async (client, message) => {
    const chat = await message.getChat()
    const foundchat = await Chat.findOne({ phone_number: chat.id.user })
    if(!foundchat){
        const createdChat = await Chat.create({
            phone_number: chat.id.user
        })
        return {chat: createdChat, success: false}
    }
    else if (foundchat.isVerifed == true) {
        return { chat: foundchat, success: true };
    }
    else {
        return { chat: foundchat, success: false };
    }
}

module.exports = checkVerifed