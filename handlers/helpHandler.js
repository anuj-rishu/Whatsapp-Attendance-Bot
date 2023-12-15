const helpHandler = async (rclient, message) => {
    rclient.set(message.payload.source, value + 1, { XX: true })
    await rclient.disconnect()
    // client.sendMessage(message.from, "*/att*                To get your attendance\n*/tt*                  To get today's time-table\n*/wtt*               To get your whole time-table\n*/mess*           To get what's in mess\n*/suggest*      To suggest a feature\n*/advertise*    To advertise")
}

module.exports = helpHandler