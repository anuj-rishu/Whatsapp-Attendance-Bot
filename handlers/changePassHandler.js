const Chat = require("../models/Chat");
const Update = require("../models/Update");
const axios = require("axios")
const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')

const changePassHandler = async (chat, message) => {
    const pattern = /\/cp (\S+)/i;
    const match = message.body.match(pattern);
    if (match === null) {
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `Type */cp {Password}* to change/reverify password`})
        return;
    }
    else {
        const newpassword = match[1];
        if (!chat.hasIssue) {
            client.incr(message.payload.source)
            // await client.disconnect()
            await SendMessage({to: message.payload.source, message: `Sorry we dont find any problem with your password! If we find any problem we will ask you to change your password!`})
            return;
        }
        else {
            let response;
            try {
                response = await axios.post(process.env.SRM_TOKEN_URL, {
                    username: chat.userid,
                    password: newpassword
                })
                if (response.data.message && response.data.message === "Wrong email or password") {
                    client.incr(message.payload.source)
                    // await client.disconnect()
                    await SendMessage({to: message.payload.source, message: `Given password seems to be incorrect! Please Enter your Academia Password.\nTry again using */cp* command`})
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
                    client.incr(message.payload.source)
                    // await client.disconnect()
                    await SendMessage({to: message.payload.source, message: `Congrats your password has been changed!\n\nYou will start receiving updates soon!\nType */help* to get all commands`})
                    return;
                }
                else {
                    client.incr(message.payload.source)
                    // await client.disconnect()
                    await SendMessage({to: message.payload.source, message: `There seems to be something wrong with your password or with the server!\n\nSending report to Admin to look into the matter!`})
                    return;
                }
            }
            catch (error) {
                client.incr(message.payload.source)
                // await client.disconnect()
                await SendMessage({to: message.payload.source, message: `There seems to be something wrong with your password or with the server!\n\nSending report to Admin to look into the matter!`})
                return;
            }
        }
    }
}

module.exports = changePassHandler