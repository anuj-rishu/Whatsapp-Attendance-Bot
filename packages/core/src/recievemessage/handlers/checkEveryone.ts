import Update from '../../models/Update';
import axios from 'axios';
import Chat from '../../models/Chat';
import getSubjectsWithMoreAbsentHours from '../../utils/getSubjectsWithMoreAbsentHours';
// import checkPayment from '../middleware/checkPayment';
import SendMessage from '../../utils/SendMessage';
import client from '../../utils/redisConnection';


function getCurrentTimeIndia() {
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const currentTime = new Date().toLocaleTimeString('en-US', options);
    return currentTime;
}


const checkEveryone = async () => {
    const allPeople = await Update.find({ __v: 0 });
    if (allPeople) {
        allPeople.forEach(async (people) => {
            try {
                // if ((await checkPayment(chat, client, message, true)).success) {
                let res;
                res = await axios.post(process.env.SRM_USER_URL!, {}, {
                    headers: {
                        "X-Access-Token": people.token
                    }
                });
                if (res.data.error) {
                    const chat = await Chat.findById(people.chatid)!
                    if(!chat) return;
                    let res2 = await axios.post(process.env.SRM_TOKEN_URL!, {
                        username: chat.userid,
                        password: chat.password
                    })
                    let res3 = await axios.post(process.env.SRM_USER_URL!, {}, {
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
                    client.incr(people.from)
                    await SendMessage({to: people.from, message: `Yay! Attendance hasn't decreased since last checked!\nChecked on: ${getCurrentTimeIndia()}`})
                }
                else {
                    let texttosend = "";
                    data.forEach(tt => {
                        if(!tt.subject_name || !tt.difference_in_hours) return;
                        texttosend += tt.subject_name.length > 32 ? `${tt.subject_name.slice(0, 20)}... ${tt.subject_name.slice(-8)}\n` : `${tt.subject_name}\n`
                        texttosend += `Hours marked Absent: ${tt.difference_in_hours}\n\n`
                    })
                    texttosend += `Checked on: ${getCurrentTimeIndia()}`
                    client.incr(people.from)
                    await SendMessage({to: people.from, message: `Attendance Decreased!\n${texttosend}`})
                }
                // }
            } catch (error) {
                await Chat.findByIdAndUpdate(people.chatid, {
                    hasIssue: true
                })
                client.incr(people.from)
                await SendMessage({to: people.from, message: `Sorry there was a problem checking your Attendance! Please verify your password again! Using */cp* command`})
            }
        });
        // await client.disconnect()
        return;
    }
}

export default checkEveryone