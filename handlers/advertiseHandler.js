const Update = require("../models/Update")

const advertiseHandler = async (rclient, message) => {
    const noofpeople = await Update.countDocuments();
    rclient.set(message.payload.source, value + 1, { XX: true })
    await rclient.disconnect()
    // client.sendMessage(message.payload.source, `Hi there!\n\nLooking to reach a rapidly growing broad audience of ${noofpeople}+ college students? Want to promote your event, club, or important announcement? We've got you covered!\n\nWith our platform, you can easily connect with ${noofpeople} engaged and active students. Utilize the power of WhatsApp to reach them directly! Whether it's an upcoming event, a club meeting, or an academic update, your message will be delivered straight to their WhatsApp inbox.\n\nHit up my inbox to advertise.\n${process.env.MY_MAILID}`)
    return;  
}

module.exports = advertiseHandler