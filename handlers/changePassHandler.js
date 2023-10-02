const Chat = require("../models/Chat");
const Update = require("../models/Update");
const axios = require("axios")

const changePassHandler = async (chat, client, message) => {
    const pattern = /\/cp (\S+)/i;
    const match = message.body.match(pattern);
    if (match === null) {
        client.sendMessage(message.from, `Type */cP {newPassword}*\nto change password`)
    }
    else {
        const newpassword = match[1];
        if (!chat.hasIssue) {
            client.sendMessage(message.from, "Sorry we dont find any problem with your password! If we find any problem we will ask you to change your password!");
        }
        else {
            client.sendMessage(message.from, "Please wait verifing...");
            let response;
            try {
                response = await axios.post("https://academia-s.azurewebsites.net/login", {
                    username: chat.userid,
                    password: newpassword
                })
                if (response.data.message && response.data.message === "Wrong email or password") {
                    client.sendMessage(message.from, "Given password seems to be incorrect!\ntry again using */cP* command")
                    return;
                }
                else if (response.data.token) {
                    await Chat.findByIdAndUpdate(chat._id, {
                        password: newpassword,
                        token: response.data.token,
                        hasIssue: false
                    })
                    await Update.findOneAndUpdate({
                        chatid: chat._id
                    }, {
                        token: response.data.token
                    })
                    client.sendMessage(message.from, "Congrats your password has been changed!\n\nYou will start receiving updates soon!")
                    client.sendMessage(message.from, "Type */help* to get all commands")
                    return;
                }
                else {
                    client.sendMessage(message.from, "There seems to be something wrong with your password or with the server!\n\nSending report to Admin to look into the matter!")
                    // let prefix = "ErrorFrom: "
                    // client.sendMessage(process.env.MY_PHONE, prefix += chat.phone_number);
                    return;
                }
            }
            catch (error) {
                client.sendMessage("There seem to be some problem with the server!\nPlease try again after some time!\n\nSending report to Admin to look into the matter!");
                // let prefix = `ChangePassErrorFrom: ${chat.phone_number}`
                // client.sendMessage(process.env.MY_PHONE, prefix);
                return;
            }
        }
    }
}

module.exports = changePassHandler