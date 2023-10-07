const helpHandler = async (client, message) => {
    client.sendMessage(message.from, "*/att*                To get your attendace\n*/tt*                  To get today's time-table\n*/wtt*               To get your whole time-table\n*/mess*           To get what's in mess\n*/cp*                To Change Password\n*/suggest*      To suggest a feature\n*/advertise*    To advertise")
}

module.exports = helpHandler