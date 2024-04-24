import firstcheck from './middleware/firstcheck';
import checkVerifed from './middleware/checkverified';
// import paymentHandler from './handlers/paymentHandler';
// import checkPayment from './middleware/checkPayment';
import verifyHandler from './handlers/verifyHandler';
import advertiseHandler from './handlers/advertiseHandler';
import suggestHandler from './handlers/suggestHandler';
import helpHandler from './handlers/helpHandler';
import changePassHandler from './handlers/changePassHandler';
import issueCheck from './middleware/issueCheck';
import attHandler from './handlers/attHandler';
import ttHandler from "./handlers/ttHandler";
import advertiseEveryone from "./handlers/advertiseEveryoneHandler";
import wttHandler from "./handlers/wttHandler";
import checkEveryone from "./handlers/checkEveryone";
import messHandler from './handlers/messHandler';
import checkSpam from './middleware/checkSpam';
import connectDb from './utils/connectDb';
import type MessageType from './types/message';
import dotenv from 'dotenv';
dotenv.config();
connectDb()

import express from 'express'

const app = express();
import bodyParser from 'body-parser';

app.use(bodyParser.json());

app.post('/recievemessage', async (req, res) => {
    res.sendStatus(200);
    const message: MessageType = req.body;
    if (message.payload.type == "text" && message.payload.payload.text) {
        const isSpam = await checkSpam(message)
        if(!isSpam && message.payload.type == 'text'){
            const verifyRegex = /\/verify/i;
            if (verifyRegex.test(message.payload.payload.text)) {
                const res = await checkVerifed(message)
                if (res.success) {
                    // Already Verified, Do Nothing
                    return;
                }
                else {
                    verifyHandler(res.chat ,message)
                    return;
                }
            }
            const firstResponse = await firstcheck(message);
            if (firstResponse.message === "Chat created" || firstResponse.message == "Chat found") return;
            const helpRegex = /\/help/i;
            if (helpRegex.test(message.payload.payload.text)) {
                helpHandler(message);
                return;
            }
            const changePassRegex = /\/cp/i;
            if (changePassRegex.test(message.payload.payload.text)) {
                changePassHandler(firstResponse.chat, message);
                return;
            }
            const hasIssueCheck = await issueCheck(firstResponse?.chat, message);
            if (hasIssueCheck.success === false) return;
            // const paymentRegex = /\/payment/i;
            // if (paymentRegex.test(message.payload.payload.text)) {
            //     const res = await checkPayment(firstResponse.chat,  message, false)
            //     if (res.success == false  || message.type ==  res.partial == false) {
            //         paymentHandler(firstResponse.chat,  message);
            //     }
            //     else if (res.success && res.partial) {
            //         client.sendMessage(message.from, "Your subscription is not over!\nWe will remind you when your subscription is about to expire")
            //     }
            //     return;
            // }
            // const paymentResponse = await checkPayment(firstResponse.chat,  message, true);
            // if (paymentResponse.success === false) {
            //     paymentHandler(firstResponse.chat,  message);
            //     return;
            // }
            const suggestRegex = /\/suggest/i;
            if (suggestRegex.test(message.payload.payload.text)) {
                await suggestHandler(message)
                return;
            }
            // CREDITS TO SRMCHECK.ME FOR PROVIDING DATA
            const attRegex = /\/att/i;
            if (attRegex.test(message.payload.payload.text)) {
                await attHandler(firstResponse?.chat, message)
                return;
            }
            // CREDITS TO SRMCHECK.ME FOR PROVIDING DATA
            const ttRegex = /\/tt/i;
            if (ttRegex.test(message.payload.payload.text)) {
                await ttHandler(firstResponse?.chat, message)
                return;
            }
            // CREDITS TO SRMCHECK.ME FOR PROVIDING DATA
            const wttRegex = /\/wtt/i;
            if (wttRegex.test(message.payload.payload.text)) {
                await wttHandler(firstResponse?.chat, message)
                return;
            }
            // CREDITS TO WHAT'S IN MESS FOR PROVIDING THE DATA
            const messRegex = /\/mess/i;
            if (messRegex.test(message.payload.payload.text)) {
                await messHandler(message)
                return;
            }
            const advertieRegex = /\/advertise/i;
            if (advertieRegex.test(message.payload.payload.text)) {
                await advertiseHandler(message)
                return;
            }
            const checkeveryoneRegex = /\/checkeveryone/i;
            if (checkeveryoneRegex.test(message.payload.payload.text) && message.payload.source === process.env.MY_PHONE) {
                await checkEveryone(message)
                return;
            }
            const everyoneRegex = /\/everyone/i;
            if (everyoneRegex.test(message.payload.payload.text) && message.payload.source === process.env.MY_PHONE) {
                await advertiseEveryone(message)
                return;
            }
            else {
                // await client.incr(message.payload.source)
                // await SendMessage({to: message.payload.source, message: `Please type */help* to get available commands!`})
                // client.disconnect()
                return;
            }
        }
        else{
            // client.disconnect();
        }
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`SSE server is running on port ${port}`);
});

