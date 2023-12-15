const suggestHandler = async (chat, rclient, message) => {
    const pattern = /\/suggest\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        // client.sendMessage(message.from, `Type:\n*/suggest* {Your Suggestion}`)
        return;
    }
    else if (match) {
        const response = match[1];
        let prefix = "Suggestion: "
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        // client.sendMessage(process.env.MY_PHONE, prefix += response)
        // client.sendMessage(message.from, "Your suggestion was submitted!")
        return;
    }
}

module.exports = suggestHandler