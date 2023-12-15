const mongoose = require('mongoose');
const firstcheck = require('./middleware/firstcheck.js');
const checkVerifed = require('./middleware/checkverified');
const paymentHandler = require('./handlers/paymentHandler');
const verifyHandler = require('./handlers/verifyHandler');
const advertiseHandler = require('./handlers/advertiseHandler');
const suggestHandler = require('./handlers/suggestHandler');
const helpHandler = require('./handlers/helpHandler');
const changePassHandler = require('./handlers/changePassHandler');
const checkPayment = require('./middleware/checkPayment');
const issueCheck = require('./middleware/issueCheck');
const attHandler = require('./handlers/attHandler');
const ttHandler = require("./handlers/ttHandler");
const advertiseEveryone = require("./handlers/advertiseEveryoneHandler");
const wttHandler = require("./handlers/wttHandler");
const checkEveryone = require("./handlers/checkEveryone");
const messHandler = require('./handlers/messHandler');
const express = require('express')
const bodyParser = require('body-parser');
const checkSpam = require('./middleware/checkSpam.js');
const { createClient } = require('redis')
require('dotenv').config()

/**
 * @typedef {Object} MessageType
 * @property {string} app - The name of the application.
 * @property {number} timestamp - The timestamp of the message.
 * @property {number} version - The version of the message.
 * @property {string} type - The type of the message. Should be one of "text", "image", "file", "audio", "video", "contact", "location", "button_reply", or "list_reply".
 * @property {Object} payload - The payload of the message.
 * @property {string} payload.id - The ID of the message payload.
 * @property {string} payload.source - The source of the message.
 * @property {string} payload.type - The type of the payload.
 * @property {Object} payload.payload - The payload data.
 * @property {string} payload.payload.text - The text of the message if the type is "text".
 * @property {Object} payload.sender - Information about the sender.
 * @property {string} payload.sender.phone - The phone number of the sender.
 * @property {string} payload.sender.name - The name of the sender.
 * @property {string} payload.sender.country_code - The country code of the sender.
 * @property {string} payload.sender.dial_code - The dial code of the sender.
 */

const app = express()
app.use(bodyParser.json());
const port = 3000
const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-16896.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16896
    }
});

app.post('/recievemessage', async (req, res) => {
    /** @type {MessageType} */
    const message = req.body;
    res.json({ success: true }).status(200)
    const rclient = await client.connect();
    const {isSpam, spamValue} = await checkSpam(rclient, message)
    if (!isSpam) {
        if(message.type == "text"){
            const verifyRegex = /\/verify/i;
            if (verifyRegex.test(message.payload.payload.text)) {
                const res = await checkVerifed(message)
                if (res.success) {
                    // Already Verified, Do Nothing
                    return;
                }
                else {
                    verifyHandler(res.chat, rclient, spamValue ,message)
                    return;
                }
            }
            const firstResponse = await firstcheck(rclient, message);
            if (firstResponse.message === "Chat created") return;
            const helpRegex = /\/help/i;
            if (helpRegex.test(message.payload.payload.text)) {
                helpHandler(rclient, message);
                return;
            }
            const changePassRegex = /\/cp/i;
            if (changePassRegex.test(message.payload.payload.text)) {
                changePassHandler(firstResponse.chat, rclient, message);
                return;
            }
            const hasIssueCheck = await issueCheck(firstResponse.chat, rclient, message);
            if (hasIssueCheck.success === false) return;
            // const paymentRegex = /\/payment/i;
            // if (paymentRegex.test(message.payload.payload.text)) {
            //     const res = await checkPayment(firstResponse.chat, rclient, message, false)
            //     if (res.success == false || res.partial == false) {
            //         paymentHandler(firstResponse.chat, rclient, message);
            //     }
            //     else if (res.success && res.partial) {
            //         client.sendMessage(message.from, "Your subscription is not over!\nWe will remind you when your subscription is about to expire")
            //     }
            //     return;
            // }
            // const paymentResponse = await checkPayment(firstResponse.chat, rclient, message, true);
            // if (paymentResponse.success === false) {
            //     paymentHandler(firstResponse.chat, rclient, message);
            //     return;
            // }
            const suggestRegex = /\/suggest/i;
            if (suggestRegex.test(message.payload.payload.text)) {
                await suggestHandler(firstResponse.chat, rclient, message)
                return;
            }
            // CREDITS TO SRMCHECK.ME FOR PROVIDING DATA
            const attRegex = /\/att/i;
            if (attRegex.test(message.payload.payload.text)) {
                await attHandler(firstResponse.chat, rclient, message)
                return;
            }
            // CREDITS TO SRMCHECK.ME FOR PROVIDING DATA
            const ttRegex = /\/tt/i;
            if (ttRegex.test(message.payload.payload.text)) {
                await ttHandler(firstResponse.chat, rclient, message)
                return;
            }
            // CREDITS TO SRMCHECK.ME FOR PROVIDING DATA
            const wttRegex = /\/wtt/i;
            if (wttRegex.test(message.payload.payload.text)) {
                await wttHandler(firstResponse.chat, rclient, message)
                return;
            }
            // CREDITS TO WHAT'S IN MESS FOR PROVIDING THE DATA
            const messRegex = /\/mess/i;
            if (messRegex.test(message.payload.payload.text)) {
                await messHandler(rclient, message)
                return;
            }
            const advertieRegex = /\/advertise/i;
            if (advertieRegex.test(message.payload.payload.text)) {
                await advertiseHandler(rclient, message)
                return;
            }
            const checkeveryoneRegex = /\/checkeveryone/i;
            if (checkeveryoneRegex.test(message.payload.payload.text) && message.payload.source === process.env.MY_PHONE) {
                await checkEveryone(rclient)
                return;
            }
            const everyoneRegex = /\/everyone/i;
            if (everyoneRegex.test(message.payload.payload.text) && message.payload.source === process.env.MY_PHONE) {
                await advertiseEveryone(rclient, message)
                return;
            }
            else {
                rclient.set(message.payload.source, value + 1, { XX: true })
                await rclient.disconnect()
                // client.sendMessage(message.from, "Please type */help* to get available commands!")
                return;
            }
        }
        else{
            await rclient.disconnect()
        }
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
