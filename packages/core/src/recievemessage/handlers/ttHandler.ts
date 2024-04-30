import { ChatDocument } from "../../models/Chat";
import MessageType from "../../types/message";
import axios from "axios";
import SendMessage from '../../utils/SendMessage';
import client from '../../utils/redisConnection';
import { Config } from "sst/node/config";


const getDayOrder = async () => {
    try {
        const res = await axios.post(Config.SRM_DO_URL!)
        if(res.data.error) throw res.data.error;
        if(res.data && res.data.day_order.includes("No Day Order")){
            return {response: "No Day Order"};
        }
        else{
            return { response: res.data.day_order.slice(0,1)};
        }
    } catch (error) {
        throw error;
    }
}

const ttHandler = async (chat: ChatDocument, message: MessageType) => {
    try {
        const dayorder = await getDayOrder()
        if(dayorder.response === "No Day Order"){
            client.incr(message.payload.source)
            // await client.disconnect()
            await SendMessage({to: message.payload.source, message: `No day order could be found for today.\n*Seem's Like a holiday!*\nUse */wtt* command to get full time-table.`})
            return;
        }
        const buffer = chat.timetable?.find(obj => obj.day_order === Number(dayorder.response))!
        let stringtosend = `Time-Table (Day order ${dayorder.response})\n\n`
        buffer.time_table?.forEach(tt => {
            if(!tt || !tt.course_name || !tt.time) return;
            const stringtoconcat = (`${tt.course_name.length > 12 ? tt.course_name.slice(0, 12) + '...' : tt.course_name} => ${tt.time}\n`);
            stringtosend += stringtoconcat
        });
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: stringtosend.slice(0,-1)})
        return;
    } catch (error) {
        console.log(error)
        let stringtosend = `Time-Table:`
        chat.timetable?.forEach(tt => {
            stringtosend += "\n\n";
            stringtosend += `Day Order ${tt.day_order}\n`
            tt.time_table?.forEach(tt2 => {
                if(!tt2 || !tt2.course_name || !tt2.time) return;
                stringtosend += `${tt2.course_name.length > 12 ? tt2.course_name.slice(0, 12) + '...' : tt2.course_name} => ${tt2.time}\n`
            });
        });
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `There was a problem while fetching day-order!\nSending you your whole time-table\n${stringtosend.slice(0, -1)}`})
        return;
    }
}

export default ttHandler