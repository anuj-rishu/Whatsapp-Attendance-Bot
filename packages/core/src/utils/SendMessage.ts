import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SendMessage = async ({to, message}: {to: string, message: string}) => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
        'apikey': process.env.GUPSHUP_KEY
    };
    const data = new URLSearchParams();
    data.append('channel', 'whatsapp');
    data.append('source', process.env.GUPSHUP_FROM_NUMBER!);
    data.append('destination', to);
    data.append('message', `{"type":"text","text": "${message}"}`);
    data.append('src.name', process.env.GUPSHUP_APP_NAME!);
    data.append('disablePreview', 'false');
    data.append('encode', 'false');
    try {
        const res = await axios.post(process.env.SEND_URL!, data, { headers })
    } catch (error) {
        console.log("error", error)
    }
}

export default SendMessage;