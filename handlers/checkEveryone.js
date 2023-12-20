const Update = require('../models/Update');
const axios = require('axios');
const Chat = require('../models/Chat');
const getSubjectsWithMoreAbsentHours = require('../utils/getSubjectsWithMoreAbsentHours');
const checkPayment = require('../middleware/checkPayment');
const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

function getCurrentTimeIndia() {
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const currentTime = new Date().toLocaleTimeString('en-US', options);
    return currentTime;
}


const checkEveryone = async (value) => {
    const rclient = connection.Client;
    const allPeople = await Update.find({ __v: 0 });
    if (allPeople) {
        allPeople.forEach(async (people) => {
            try {
                // if ((await checkPayment(chat, client, message, true)).success) {
                let res;
                res = await axios.post(process.env.DATA_URL, {}, {
                    headers: {
                        "X-Access-Token": people.token
                    }
                });
                if (res.data.error) {
                    const chat = await Chat.findById(people.chatid)
                    let res2 = await axios.post(process.env.TOKEN_URL, {
                        username: chat.userid,
                        password: chat.password
                    })
                    let res3 = await axios.post(process.env.DATA_URL, {}, {
                        headers: {
                            "X-Access-Token": res2.data.token
                        }
                    });
                    if (res3.data.error) {
                        await Chat.findByIdAndUpdate(people.chatid, {
                            hasIssue: true
                        })
                        throw res3.data.error;
                    }
                    else {
                        res = res3;
                        await Chat.findByIdAndUpdate(people.chatid, {
                            hasIssue: false,
                            token: res2.data.token
                        })
                        await Update.findByIdAndUpdate(people._id, {
                            token: res2.data.token
                        })
                    }
                }
                const data = getSubjectsWithMoreAbsentHours(people.courses, res.data);
                if (data.length <= 0) {
                    // rclient.set(people.from, value + 1, { XX: true })
                    await SendMessage({to: message.payload.source, message: `Yay! Attendance hasn't decreased since last checked!\nChecked on: ${getCurrentTimeIndia()}`})
                }
                else {
                    let texttosend = "";
                    data.forEach(tt => {
                        texttosend += tt.subject_name.length > 32 ? `${tt.subject_name.slice(0, 20)}... ${tt.subject_name.slice(-8)}\n` : `${tt.subject_name}\n`
                        texttosend += `Hours marked Absent: ${tt.difference_in_hours}\n\n`
                    })
                    texttosend += `Checked on: ${getCurrentTimeIndia()}`
                    // rclient.set(people.from, value + 1, { XX: true })
                    await SendMessage({to: message.payload.source, message: `Attendance Decreased!\n${texttosend}`})
                }
                // }
            } catch (error) {
                await Chat.findByIdAndUpdate(people.chatid, {
                    hasIssue: true
                })
                // rclient.set(people.from, value + 1, { XX: true })
                await SendMessage({to: message.payload.source, message: `Sorry there was a problem checking your Attendance! Please verify your password again! Using */cp* command`})
            }
        });
        await rclient.disconnect()
        return;
    }
}

module.exports = checkEveryone