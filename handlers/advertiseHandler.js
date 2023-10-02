const Update = require("../models/Update")

const advertiseHandler = async (client, message) => {
    const people = await Update.find({__v: 0})
    const noofpeople = people.length;
    client.sendMessage(message.from, `Hi there!\n\nLooking to reach a rapidly growing broad audience of ${noofpeople} college students? Want to promote your event, club, or important announcement? We've got you covered!\n\nWith our platform, you can easily connect with ${noofpeople} engaged and active students. Utilize the power of WhatsApp to reach them directly! Whether it's an upcoming event, a club meeting, or an academic update, your message will be delivered straight to their WhatsApp inbox.\n\nHit up my inbox with a email to advertise.\n${process.env.MY_MAILID}`)
    return;  
}

module.exports = advertiseHandler