import MessageType from '../../types/message';
import SendMessage from '../../utils/SendMessage';
import client from '../../utils/redisConnection';
import axios from 'axios';
import dotenv from 'dotenv';
import { Config } from "sst/node/config";

dotenv.config();

const checkSpam = async (message: MessageType) => {
    const value = Number(await client.get(message.payload.source))
    if (value !== null && value !== 0) {
        if (value <= 20) {
            await client.incr(message.payload.source)
            return false;
        }
        else if (value > 20 && value < 25) {
            await client.incrby(message.payload.source, 2)
            await SendMessage({ to: message.payload.source, message: "There is a rate limit, Please do not send any more messages in this day or you will get banned!!!" })
            return false;
        }
        else {
            await blockUser(message.payload.source)
            // client.disconnect()
            return true;
        }
    }
    else {
        await client.setex(message.payload.source, 86400, 1)
        return false;
    }
};

const blockUser = async (phone: string) => {
    const data = new URLSearchParams();
    data.append('phone', phone);
    data.append('block', 'true');
    try {
        const res = await axios.put(`${Config.BLOCK_URL}/${Config.GUPSHUP_APP_NAME}`, data, {
            headers: {
                'apikey': Config.GUPSHUP_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return res.data
    } catch (error) {
        await SendMessage({ to: Config.MY_PHONE!, message: `Block this number: ${phone} !!!` })
    }
}

export default checkSpam;
export { blockUser };