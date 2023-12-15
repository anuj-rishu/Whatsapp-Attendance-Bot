const wttHandler = async (chat, rclient, message) => {
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
        // client.sendMessage(message.from, stringtosend);
        return;
    } catch (error) {
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        // client.sendMessage("There was some problem, Please try again!")
        return;
    }
}

module.exports = wttHandler