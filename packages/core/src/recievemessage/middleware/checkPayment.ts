const checkPayment = async (chat, client, message, tosendmessage) => {
    if (chat.hasPaid) {
        const timeDifference = new Date(chat.dueAt) - new Date(chat.paidAt);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        if (daysDifference <= 0) {
            {tosendmessage && client.sendMessage(message.from, `Please pay ₹29 for 1 YEAR using */payment* command to continue using this bot!\nYour Subscription has ended!`)}
            return { success: false }
        }
        else if (daysDifference <= 5) {
            {tosendmessage && client.sendMessage(message.from, `Your Subscription is about to expire in ${daysDifference} days, please pay ₹29 for 1 YEAR to continue using Attendance bot for a year!`)}
            return { success: true, partial: false }
        }
        else {
            return { success: true, partial: true }
        }
    }
    else {
        const timeDifference = new Date(chat.dueAt) - new Date(chat.verifiedAt);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        if (daysDifference <= 0) {
            {tosendmessage && client.sendMessage(message.from, `Your Free Trial has ended!\n\nPlease pay ₹29 for 1 YEAR by typing */payment* command`)};
            return { success: false }
        }
        else if(daysDifference <= 5){
            {tosendmessage && client.sendMessage(message.from, `Your Free trial is about to expire in ${daysDifference} days!\n\nyou can pay ₹29 for 1 YEAR by typing */payment* command`)}
            return { success: true, partial: false }
        }
        else {
            return { success: true, partial: true }
        }
    }

}

export default checkPayment