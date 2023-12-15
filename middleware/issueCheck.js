const issueCheck = async (chat, rclient, message) => {
    if(!chat.hasIssue){
        return {success: true}
    }
    else{
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        // client.sendMessage(message.from, "We have detected a Issue with your account\n\nPlease use */cp* command to change your password")
        return {success: false}
    }
}

module.exports = issueCheck