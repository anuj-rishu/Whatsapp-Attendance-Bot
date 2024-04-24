import MessageType from "../types/message";
import Update from "../models/Update";
import SendMessage from '../utils/SendMessage';
import client from '../utils/redisConnection';


const advertiseHandler = async (message: MessageType) => {
    const noofpeople = await Update.countDocuments();
    client.incr(message.payload.source)
    // await client.disconnect()
    await SendMessage({to: message.payload.source, message: `Hi there!\n\nLooking to reach a rapidly growing broad audience of ${noofpeople}+ college students? Want to promote your event, club, or important announcement? We've got you covered!\n\nWith our platform, you can easily connect with ${noofpeople} engaged and active students. Utilize the power of WhatsApp to reach them directly! Whether it's an upcoming event, a club meeting, or an academic update, your message will be delivered straight to their WhatsApp inbox.\n\nHit up my inbox to advertise.\n${process.env.MY_MAILID}`})
    return;  
}

export default advertiseHandler