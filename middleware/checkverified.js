const Chat = require("../models/Chat")

const checkVerifed = async (message) => {
    const foundchat = await Chat.findOne({ phone_number: message.payload.payload.text })
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

module.exports = checkVerifed