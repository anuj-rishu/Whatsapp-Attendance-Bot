const suggestHandler = async (chat, client, message) => {
    const pattern = /\/suggest\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        client.sendMessage(message.from, `Type:\n*/suggest* {Your Suggestion}`)
        return;
    }
    else if (match) {
        const response = match[1];
        let prefix = "Suggestion: "
        client.sendMessage(process.env.MY_PHONE, prefix += response)
        client.sendMessage(message.from, "Your suggestion was submitted!")
        return;
    }
}

module.exports = suggestHandler