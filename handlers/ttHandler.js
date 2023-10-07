const Chat = require("../models/Chat");
const axios = require("axios")

const getDayOrder = async () => {
    try {
        const res = await axios.post("https://academia-s.azurewebsites.net/do")
        if(res.data.error) throw res.data.error;
        if(res.data && res.data.day_order.includes("No Day Order")){
            return {response: "No Day Order"};
        }
        else{
            return { response: res.data.day_order.slice(0,1)};
        }
    } catch (error) {
        return { error }
    }
}

const ttHandler = async (chat, client, message) => {
    try {
        client.sendMessage(message.from, "Please wait fetching your time-table...")
        const dayorder = await getDayOrder()
        if(dayorder.error) throw dayorder.error;
        if(dayorder.response === "No Day Order"){
            client.sendMessage(message.from, "No day order could be found for today.\n*Seem's Like a holiday!*");
            client.sendMessage(message.from, "Use */wtt* command to get full time-table.");
            return;
        }
        const buffer = chat.timetable.find(obj => obj.day_order === Number(dayorder.response))
        let stringtosend = `Time-Table (Day order ${dayorder.response})\n\n`
        buffer.time_table.forEach(tt => {
            const stringtoconcat = (`${tt.course_name.length > 12 ? tt.course_name.slice(0, 12) + '...' : tt.course_name} => ${tt.time}\n`);
            stringtosend += stringtoconcat
        });
        client.sendMessage(message.from, stringtosend.slice(0,-1));
        return;
    } catch (error) {
        client.sendMessage(message.from, "There was a problem while fetching day-order!\nSending you your whole time-table")
        let stringtosend = `Time-Table:`
        chat.timetable.forEach(tt => {
            stringtosend += "\n\n";
            stringtosend += `Day Order ${tt.day_order}\n`
            tt.time_table.forEach(tt2 => {
                stringtosend += `${tt2.course_name.length > 12 ? tt2.course_name.slice(0, 12) + '...' : tt2.course_name} => ${tt2.time}\n`
            });
        });
        client.sendMessage(message.from, stringtosend.slice(0, -1));
        return;
    }
}

module.exports = ttHandler