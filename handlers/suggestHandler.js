const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

const suggestHandler = async (chat, value, message) => {
    const rclient = connection.Client;
    const pattern = /\/suggest\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: message.payload.source, message: `Type:\n*/suggest* {Your Suggestion}`})
        return;
    }
    else if (match) {
        const response = match[1];
        let prefix = "Suggestion: "
        rclient.set(message.payload.source, value + 2, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: process.env.MY_PHONE, message: prefix += response})
        await SendMessage({to: message.payload.source, message: `Your suggestion was submitted!`})
        return;
    }
}

module.exports = suggestHandler