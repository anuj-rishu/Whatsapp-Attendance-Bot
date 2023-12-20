const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

const issueCheck = async (chat, value, message) => {
    const rclient = connection.Client;
    if(!chat.hasIssue){
        return {success: true}
    }
    else{
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: message.payload.source, message: `We have detected a Issue with your account\n\nPlease use */cp* command to change your password`})
        return {success: false}
    }
}

module.exports = issueCheck