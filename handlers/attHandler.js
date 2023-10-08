const Chat = require("../models/Chat");
const axios = require("axios");
const getSubjectsWithMoreAbsentHours = require("../utils/getSubjectsWithMoreAbsentHours");
const Update = require("../models/Update");
const extractDetails = require("../utils/extractDetails");

function getRequired(e, t) {
    for (var n = 0; ;) {
        if (100 * (t + n) / (e + n) >= 75)
            return n;
        n++
    }
}

function getMargin(e, t) {
    for (var n = 0; ;) {
        if (100 * t / (e + n) === 75 && 0 === n)
            return n;
        if (100 * t / (e + n) > 75)
            n += 1;
        else if (100 * t / (e + n) <= 75)
            return 100 * t / (e + n) === 75 ? n : n -= 1
    }
}

function getFinal(conductedHours, presentHours) {
    const r1 = getRequired(conductedHours, presentHours)
    const r2 = getMargin(conductedHours, presentHours)
    if (r1 === 0) return r2;
    if (r2 === -1) return -1 * r1;
}

const attHandler = async (chat, client, message) => {
    const attendance = chat.courses;
    try {
        client.sendMessage(message.from, "Please wait fetching your attendance...")
        let res
        res = await axios.post("https://academia-s.azurewebsites.net/course-user", {}, {
            headers: {
                "X-Access-Token": chat.token
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
        const data = getSubjectsWithMoreAbsentHours(attendance, res.data);
        if (data.length <= 0) {
            let messagetosend = "Attendance:\n\n"
            attendance.forEach(Object => {
                messagetosend += Object.subject_name.length > 32 ? `${Object.subject_name.slice(0, 20)}... ${Object.subject_name.slice(-8)}\n` : `${Object.subject_name}\n`
                const marorreq = getFinal(Object.conducted_hours, Object.conducted_hours - Object.absent_hours)
                messagetosend += `${marorreq >= 0 ? `Margin:*${marorreq}*` : `Required:*${-1 * marorreq}*`}  Abs:*${Object.absent_hours}*  %:*${Math.round(((Object.conducted_hours - Object.absent_hours) * 100) / Object.conducted_hours)}*\n\n`
            });
            client.sendMessage(message.from, messagetosend.slice(0, -2))
            client.sendMessage(message.from, "Yay! Your Attendance was not decreased since last checked!")
        }
        else {
            let texttosend = "";
            data.forEach(tt => {
                texttosend += tt.subject_name.length > 32 ? `${tt.subject_name.slice(0, 20)}... ${tt.subject_name.slice(-8)}\n` : `${tt.subject_name}\n`
                texttosend += `Hours marked Absent: ${tt.difference_in_hours}\n\n`
            })
            client.sendMessage(message.from, texttosend.slice(0, -2));
            client.sendMessage(message.from, "Attendance Decreased!")
        }
        const { courses, time_table } = extractDetails(res.data);
        await Chat.findByIdAndUpdate(chat._id, {
            timetable: time_table,
            courses: courses
        });
        await Update.findOne({
            chatid: chat._id
        }, {
            courses: courses
        })
        return;

    } catch (error) {
        client.sendMessage(message.from, "Could not fetch attendance, Showing you last attendance!");
        let messagetosend = "Old Attendance:\n\n"
        attendance.forEach(Object => {
            messagetosend += Object.subject_name.length > 20 ? `${Object.subject_name.slice(0, 20)}... ${Object.subject_name.slice(-7)}\n` : `${Object.subject_name}\n`
            const marorreq = getFinal(Object.conducted_hours, Object.conducted_hours - Object.absent_hours)
            messagetosend += `${marorreq >= 0 ? `Margin:*${marorreq}*` : `Required:*${-1 * marorreq}*`}  Abs:*${Object.absent_hours}*  %:*${Math.round(((Object.conducted_hours - Object.absent_hours) * 100) / Object.conducted_hours)}*\n\n`
        });
        await Chat.findByIdAndUpdate(chat._id, {
            hasIssue: true
        });
        client.sendMessage(message.from, "Please verify your password again, Use */cp* command")
        client.sendMessage(message.from, messagetosend)
        return;
    }
}

module.exports = attHandler