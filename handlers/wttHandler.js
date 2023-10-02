const wttHandler = async (chat, client, message) => {
    try {
        client.sendMessage(message.from, "Please wait fetching your whole time-table...")
        let stringtosend = `Time-Table:`
        chat.timetable.forEach(tt => {
            stringtosend += "\n\n";
            stringtosend += `Day Order: ${tt.day_order}\n`
            tt.time_table.forEach(tt2 => {
                stringtosend += `${tt2.course_name.length > 12 ? tt2.course_name.slice(0, 12) + '...' : tt2.course_name} => ${tt2.time}\n`
            });
        });
        client.sendMessage(message.from, stringtosend);
        return;
    } catch (error) {
        console.log(error)
        client.sendMessage("There was some problem, Please try again!")
        return;
    }
}

module.exports = wttHandler