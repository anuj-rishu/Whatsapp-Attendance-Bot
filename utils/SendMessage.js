const axios = require('axios');
require('dotenv').config()

const SendMessage = async ({to, message}) => {
    console.log("sending message: ", message)
    // const url = 'https://api.gupshup.io/sm/api/v1/msg';
    // const headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'accept': 'application/json',
    //     'apikey': process.env.GUPSHUP_KEY
    // };
    // const data = new URLSearchParams();
    // data.append('channel', 'whatsapp');
    // data.append('source', "917834811114");
    // data.append('destination', to);
    // data.append('message', `{"type":"text","text": "${message}"}`);
    // data.append('src.name', process.env.APP_NAME);
    // data.append('disablePreview', 'false');
    // data.append('encode', 'false');
    // try {
    //     const res = await axios.post(url, data, { headers })
    // } catch (error) {
    //     console.log(error)
    // }
}

module.exports = SendMessage