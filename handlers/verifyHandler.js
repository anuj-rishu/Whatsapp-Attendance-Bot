const axios = require('axios');
const Chat = require('../models/Chat');
const Update = require('../models/Update');
const extractDetails = require("../utils/extractDetails");
const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')


const verifyHandler = async (chat, message) => {
    const pattern = /\/verify (\w+) (\S+)/i;
    const match = message.payload.payload.text.match(pattern);
    if (match) {
        const userId = match[1];
        const password = match[2];
        try {
            const response = await axios.post(process.env.SRM_TOKEN_URL, {
                username: userId,
                password: password
            })
            if (!response.data) throw response;
            if (response.data.message && response.data.message === "Wrong email or password") {
                client.incr(message.payload.source)
                // await client.disconnect()
                await SendMessage({to: message.payload.source, message: "*Please Enter your Academia Password.*\nYour NetId or Password seems to be incorrect!"})
                return;
            }
            else {
                let token = response.data.token;
                let res;
                res = await axios.post(process.env.SRM_USER_URL, {}, {
                    headers: {
                        "X-Access-Token": token
                    }
                })
                if (res.data.error) {
                    let res2 = await axios.post(process.env.SRM_TOKEN_URL, {
                        username: userId,
                        password: password
                    })
                    let res3 = await axios.post(process.env.SRM_USER_URL, {}, {
                        headers: {
                            "X-Access-Token": res2.data.token
                        }
                    });
                    if (res3.data.error) {
                        await Chat.findByIdAndUpdate(chat._id, {
                            hasIssue: true
                        })
                        throw res3.data.error;
                    }
                    else {
                        res = res3;
                        token = res2.data.token
                    }
                }
                const { courses, time_table } = extractDetails(res.data)
                const currentDateTime = new Date();
                const dueDateTime = new Date(currentDateTime);
                dueDateTime.setDate(currentDateTime.getDate() + Number(process.env.NORMAL_FREE_TIME));
                let updatedchat = await Chat.findByIdAndUpdate(chat._id, {
                    hasIssue: false,
                    userid: userId,
                    password,
                    token,
                    isVerifed: true,
                    verifiedAt: currentDateTime,
                    dueAt: dueDateTime,
                    phone_number_from_database: res.data.user.number,
                    name: res.data.user.name,
                    register_number: res.data.user.regNo,
                    timetable: time_table,
                    courses: courses,
                    branch: res.data.user.spec ? res.data.user.spec : "",
                    sem: res.data.user.sem,
                    program: res.data.user.program
                });
                await Update.create({
                    token: token,
                    chatid: updatedchat._id,
                    courses,
                    from: message.payload.source
                })
                client.incr(message.payload.source)
                // await client.disconnect()
                await SendMessage({to: message.payload.source, message: `Congrats! ${res.data.user.name} We have verified you. you will start receiving updates soon!\nThere is a rate limit on this bot, please dont send more than 10 messages in a day or you will get blocked.\n\n*/att*                To get your attendance\n*/tt*                  To get today's time-table\n*/wtt*               To get your whole time-table\n*/mess*           To get what's in mess\n*/suggest*      To suggest a feature\n*/advertise*    To advertise`})
                // await SendMessage({to: message.payload.source, message: `Congrats! ${res.data.user.name} We have verified you. you will start receiving updates soon!\nThere is a rate limit on this bot, please dont send more than 10 messages in a day or you will get blocked.\nType */help* to get all commands`})
                return;
            }
        } catch (error) {
            console.log(error)
            client.incr(message.payload.source)
            // await client.disconnect()
            await SendMessage({to: message.payload.source, message: `Sorry there was a problem while verifying, Servers are down! Could you please try later?`})
            return;
        }
    } else {
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `Please use correct syntax to verify!\n\n*/verify {NetId} {Password}*\nExample:\n*/verify vg6796 Abc@123*`})
        return;
    }
}

module.exports = verifyHandler