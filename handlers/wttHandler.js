const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

const wttHandler = async (chat, value, message) => {
    const rclient = connection.Client;
    try {
        let stringtosend = `Time-Table:`
        chat.timetable.forEach(tt => {
            stringtosend += "\n\n";
            stringtosend += `Day Order: ${tt.day_order}\n`
            tt.time_table.forEach(tt2 => {
                stringtosend += `${tt2.course_name.length > 12 ? tt2.course_name.slice(0, 12) + '...' : tt2.course_name} => ${tt2.time}\n`
            });
        });
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: message.payload.source, message: stringtosend})
        return;
    } catch (error) {
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: message.payload.source, message: `There was some problem, Please try again!`})
        return;
    }
}

module.exports = wttHandler