const Chat = require('../models/Chat')

const firstcheck = async (client, message) => {
    const chat = await message.getChat()
    const foundchat = await Chat.findOne({ phone_number: chat.id.user });
    if (foundchat) {
        if (foundchat.isVerifed) {
            return { chat: foundchat, message: "Is verifed" }
        }
        else {
            client.sendMessage(message.from, 'Verify your Account to get started!\n(*Passwords are Encrypted*)\n\nType */verify {NetId} {Password}*\neg:\n*/verify vg6796 Abc@123*');
            return { chat: foundchat, message: "Not verified" }
        }
    }
    const createdchat = await Chat.create({
        phone_number: chat.id.user
    })
    client.sendMessage(message.from, 'Hi there, I am SRM Attendance Bot.\nI\'ll update you whenever you have been marked absent!');
    client.sendMessage(message.from, 'Verify your Account to get started!\n(*Passwords are Encrypted*)\n\nType */verify {NetId} {Password}*\neg:\n*/verify vg6796 Abc@123*');
    return { chat: createdchat, message: "Chat created" };
}

module.exports = firstcheck