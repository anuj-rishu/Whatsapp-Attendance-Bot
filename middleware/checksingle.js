const checkSingle = async (message) => {
    const chat = await message.getChat()
    if (chat.isGroup) {
        return false
    }
    else {
        return true
    }
}

module.exports = checkSingle