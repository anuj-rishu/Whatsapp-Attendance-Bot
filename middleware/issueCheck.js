const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')

const issueCheck = async (chat, message) => {
    if(!chat.hasIssue){
        return {success: true}
    }
    else{
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `We have detected a Issue with your account\n\nPlease use */cp* command to change your password`})
        return {success: false}
    }
}

module.exports = issueCheck