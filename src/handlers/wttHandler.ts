import { ChatDocument } from "../models/Chat";
import MessageType from "../types/message";
import SendMessage from '../utils/SendMessage';
import client from '../utils/redisConnection';

const wttHandler = async (chat: ChatDocument, message: MessageType) => {
    try {
        let stringtosend = `Time-Table:`
        chat.timetable?.forEach(tt => {
            stringtosend += "\n\n";
            stringtosend += `Day Order: ${tt.day_order}\n`
            tt.time_table?.forEach(tt2 => {
                if(!tt2 || !tt2.course_name || !tt2.time) return;
                stringtosend += `${tt2.course_name.length > 12 ? tt2.course_name.slice(0, 12) + '...' : tt2.course_name} => ${tt2.time}\n`
            });
        });
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: stringtosend})
        return;
    } catch (error) {
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `There was some problem, Please try again!`})
        return;
    }
}

export default wttHandler