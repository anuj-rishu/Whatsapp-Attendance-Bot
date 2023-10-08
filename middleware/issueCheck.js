const issueCheck = async (chat, client, message) => {
    if(!chat.hasIssue){
        return {success: true}
    }
    else{
        client.sendMessage(message.from, "We have detected a Issue with your account\n\nPlease use */cp* command to change your password")
        return {success: false}
    }
}

module.exports = issueCheck