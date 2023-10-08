const axios = require('axios');
const Chat = require('../models/Chat');
const Update = require('../models/Update');
const extractDetails = require("../utils/extractDetails");


const verifyHandler = async (chat, client, message) => {
    const pattern = /\/verify (\w+) (\S+)/i;
    const match = message.body.match(pattern);
    if (match) {
        client.sendMessage(message.from, "Please wait verifing...")
        const userId = match[1];
        const password = match[2];
        try {
            const response = await axios.post("https://academia-s.azurewebsites.net/login", {
                username: userId,
                password: password
            })
            if (!response.data) throw response;
            if (response.data.message && response.data.message === "Wrong email or password") {
                client.sendMessage(message.from, "*Please Enter your Academia Password.*\nYour NetId or Password seems to be incorrect!")
                return;
            }
            else {
                const token = response.data.token;
                let res;
                res = await axios.post("https://academia-s.azurewebsites.net/course-user", {}, {
                    headers: {
                        "X-Access-Token": token
                    }
                })
                if (res.data.error) {
                    const newchat = await Chat.findById(chat._id)
                    let res2 = await axios.post("https://academia-s.azurewebsites.net/login", {
                        username: newchat.userid,
                        password: newchat.password
                    })
                    let res3 = await axios.post("https://academia-s.azurewebsites.net/course-user", {}, {
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
                        await Chat.findByIdAndUpdate(chat._id, {
                            hasIssue: false,
                            token: res2.data.token
                        })
                        await Update.findOneAndUpdate({
                            chatid: chat._id
                        },{
                            token: res2.data.token
                        })
                    }
                }
                const c = await message.getChat()
                const contact = await c.getContact()
                const { courses, time_table } = extractDetails(res.data)
                if (contact.isMyContact) {
                    const currentDateTime = new Date();
                    const dueDateTime = new Date(currentDateTime);
                    dueDateTime.setDate(currentDateTime.getDate() + Number(process.env.FRIEND_FREE_TIME));
                    let updatedchat = await Chat.findByIdAndUpdate(chat._id, {
                        userid: userId,
                        password,
                        token,
                        isVerifed: true,
                        verifiedAt: currentDateTime,
                        dueAt: dueDateTime,
                        name: res.data.user.name,
                        register_number: res.data.user.regNo,
                        phone_number_from_database: res.data.user.number,
                        timetable: time_table,
                        courses: courses,
                        branch: res.data.user.spec ? res.data.user.spec : "",
                        sem: res.data.user.sem,
                        program: res.data.user.program
                    });
                    await Update.create({
                        token: token,
                        chatid: updatedchat._id,
                        courses: courses,
                        from: message.from
                    })
                    client.sendMessage(message.from, `Congrats! ${res.data.user.name} We have verified you, You will start receiving updates soon!\n\nSince You are in Viral's Contact List You will get 2 month free trial!!!`)
                }
                else {
                    const currentDateTime = new Date();
                    const dueDateTime = new Date(currentDateTime);
                    dueDateTime.setDate(currentDateTime.getDate() + Number(process.env.NORMAL_FREE_TIME));
                    let updatedchat = await Chat.findByIdAndUpdate(chat._id, {
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
                        from: message.from
                    })
                    client.sendMessage(message.from, `Congrats! ${res.data.user.name} We have verified you. you will start receiving updates soon!`)
                }
                client.sendMessage(message.from, "Type */help* to get all commands")
                return;
            }
        } catch (error) {
            client.sendMessage(message.from, "Sorry there was a problem while verifying, Servers are down! Could you please try later?")
            return;
        }
    } else {
        client.sendMessage(message.from, "Please use correct syntax to verify!\n\n*/verify {NetId} {Password}*")
        client.sendMessage(message.from, "Example:\n*/verify vg6796 Abc@123*")
        return;
    }
}

module.exports = verifyHandler