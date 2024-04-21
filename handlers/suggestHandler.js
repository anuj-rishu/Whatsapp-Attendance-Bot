const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')

const suggestHandler = async (chat, message) => {
    const pattern = /\/suggest\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `Type:\n*/suggest* {Your Suggestion}`})
        return;
    }
    else if (match) {
        const response = match[1];
        let prefix = "Suggestion: "
        client.incrby(message.payload.source, 2)
        // await client.disconnect()
        await SendMessage({to: process.env.MY_PHONE, message: prefix += response})
        await SendMessage({to: message.payload.source, message: `Your suggestion was submitted!`})
        return;
    }
}

module.exports = suggestHandler