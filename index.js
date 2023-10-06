const qrcode = require('qrcode-terminal');
const { Client, RemoteAuth, NoAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const checkSingle = require('./middleware/checksingle')
const firstcheck = require('./middleware/firstcheck.js');
const checkVerifed = require('./middleware/checkverified');
const paymentHandler = require('./handlers/paymentHandler');
const verifyHandler = require('./handlers/verifyHandler');
const advertiseHandler = require('./handlers/advertiseHandler');
const suggestHandler = require('./handlers/suggestHandler');
const helpHandler = require('./handlers/helpHandler');
const changePassHandler = require('./handlers/changePassHandler');
const checkPayment = require('./middleware/checkpayment');
const issueCheck = require('./middleware/issueCheck');
const attHandler = require('./handlers/attHandler');
const ttHandler = require("./handlers/ttHandler");
const advertiseEveryone = require("./handlers/advertiseEveryoneHandler");
const wttHandler = require("./handlers/wttHandler");
const checkEveryone = require("./handlers/checkEveryone");
const messHandler = require('./handlers/messHandler');
require('dotenv').config()



mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("connected to mongo")
    const store = new MongoStore({ mongoose: mongoose });

    const client = new Client({
        // authStrategy: new NoAuth()
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox']
        }
    });

    client.on('remote_session_saved', () => {
        console.log("remote session saved")
    })

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('message', async (message) => {
        if (await checkSingle(message)) {
            const verifyRegex = /\/verify/i;
            if (verifyRegex.test(message.body)) {
                const res = await checkVerifed(client, message)
                if (res.success) {
                    client.sendMessage(message.from, "You have already Verifed Your Account!");
                    client.sendMessage(message.from, "Type */help* to get all commands");
                    return;
                }
                else {
                    verifyHandler(res.chat, client, message)
                    return;
                }
            }
            const firstResponse = await firstcheck(client, message);
            if (firstResponse.message === "Chat created" || firstResponse.message === "Not verified") return;
            const helpRegex = /\/help/i;
            if (helpRegex.test(message.body)) {
                helpHandler(client, message);
                return;
            }
            const changePassRegex = /\/cp/i;
            if (changePassRegex.test(message.body)) {
                changePassHandler(firstResponse.chat, client, message);
                return;
            }
            const hasIssueCheck = await issueCheck(firstResponse.chat, client, message);
            if (hasIssueCheck.success === false) return;
            const paymentRegex = /\/payment/i;
            if (paymentRegex.test(message.body)) {
                const res = await checkPayment(firstResponse.chat, client, message, false)
                if (res.success == false || res.partial == false) {
                    paymentHandler(firstResponse.chat, client, message);
                }
                else if (res.success && res.partial) {
                    client.sendMessage(message.from, "Your subscription is not over!\nWe will remind you when your subscription is about to expire")
                }
                return;
            }
            const paymentResponse = await checkPayment(firstResponse.chat, client, message, true);
            if (paymentResponse.success === false) {
                paymentHandler(firstResponse.chat, client, message);
                return;
            }
            const suggestRegex = /\/suggest/i;
            if (suggestRegex.test(message.body)) {
                await suggestHandler(firstResponse.chat, client, message)
                return;
            }
            const attRegex = /\/att/i;
            if (attRegex.test(message.body)) {
                await attHandler(firstResponse.chat, client, message)
                return;
            }
            const ttRegex = /\/tt/i;
            if (ttRegex.test(message.body)) {
                await ttHandler(firstResponse.chat, client, message)
                return;
            }
            const wttRegex = /\/wtt/i;
            if (wttRegex.test(message.body)) {
                await wttHandler(firstResponse.chat, client, message)
                return;
            }
            const messRegex = /\/mess/i;
            if (messRegex.test(message.body)) {
                await messHandler( client, message)
                return;
            }
            const advertieRegex = /\/advertise/i;
            if (advertieRegex.test(message.body)) {
                await advertiseHandler( client, message)
                return;
            }
            const checkeveryoneRegex = /\/checkeveryone/i;
            if (checkeveryoneRegex.test(message.body) ) {
                await checkEveryone(client, message)
                return;
            }
            const everyoneRegex = /\/everyone/i;
            if (everyoneRegex.test(message.body)) {
                await advertiseEveryone(client, message)
                return;
            }
            else {
                client.sendMessage(message.from, "Please type */help* to get available commands!")
                return;
            }
        }
    });

    client.initialize();
});