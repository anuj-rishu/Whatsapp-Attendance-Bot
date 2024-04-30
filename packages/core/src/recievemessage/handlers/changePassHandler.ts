import { ChatDocument } from "../../models/Chat";
import MessageType from "../../types/message";
import Chat from "../../models/Chat";
import Update from "../../models/Update";
import axios from "axios";
import SendMessage from '../../utils/SendMessage';
import client from '../../utils/redisConnection';
import { Config } from "sst/node/config";


const changePassHandler = async (chat: ChatDocument, message: MessageType) => {
    const pattern = /\/cp (\S+)/i;
    const match = message.payload.payload.text?.match(pattern);
    if (match === null || match === undefined) {
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
                response = await axios.post(Config.SRM_TOKEN_URL!, {
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

export default changePassHandler