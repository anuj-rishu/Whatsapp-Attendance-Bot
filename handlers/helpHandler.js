const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

const helpHandler = async (value, message) => {
    const rclient = connection.Client;
    rclient.set(message.payload.source, value + 1, { XX: true })
    await rclient.disconnect()
    await SendMessage({to: message.payload.source, message: `*/att*                To get your attendance\n*/tt*                  To get today's time-table\n*/wtt*               To get your whole time-table\n*/mess*           To get what's in mess\n*/suggest*      To suggest a feature\n*/advertise*    To advertise`})
}

module.exports = helpHandler