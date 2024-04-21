const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')

const helpHandler = async (value, message) => {
    client.incr(message.payload.source)
    // await client.disconnect()
    await SendMessage({to: message.payload.source, message: `*/att*                To get your attendance\n*/tt*                  To get today's time-table\n*/wtt*               To get your whole time-table\n*/mess*           To get what's in mess\n*/suggest*      To suggest a feature\n*/advertise*    To advertise`})
}

module.exports = helpHandler