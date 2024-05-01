import axios from 'axios';
import dotenv from 'dotenv';
import { Config } from "sst/node/config";
dotenv.config();

const SendMessage = async ({to, message}: {to: string, message: string}) => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
        'apikey': Config.GUPSHUP_KEY
    };
    const data = new URLSearchParams();
    data.append('channel', 'whatsapp');
    data.append('source', Config.GUPSHUP_FROM_NUMBER!);
    data.append('destination', to);
    data.append('message', `{"type":"text","text": "${message}"}`);
    data.append('src.name', Config.GUPSHUP_APP_NAME!);
    data.append('disablePreview', 'false');
    data.append('encode', 'false');
    try {
        const res = await axios.post(Config.SEND_URL!, data, { headers })
    } catch (error) {
        console.log("error", error)
    }
}

export default SendMessage;