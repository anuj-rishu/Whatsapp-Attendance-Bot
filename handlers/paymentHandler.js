const axios = require('axios');
require('dotenv').config()

const paymentHandler = async (chat, client, message) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://sandbox.cashfree.com/pg/links',
            headers: {
                accept: 'application/json',
                'x-api-version': '2022-09-01',
                'content-type': 'application/json',
                'x-client-id': process.env.KEY_PUBLIC,
                'x-client-secret': process.env.KEY_SECRET
            },
            data: {
                customer_details: {
                    customer_phone: (chat.phone_number).toString().slice(2),
                    customer_email: `${chat.userid}@srmist.edu.in`,
                    customer_name: chat.name
                },
                link_notify: { send_sms: true, send_email: false },
                link_notes: { chatid: (chat._id).toString() },
                link_id: (Math.random() * 99999999999999).toString(),
                link_amount: 29,
                link_currency: 'INR',
                link_purpose: 'Payment for Whatsapp Bot',
                link_partial_payments: false,
                link_auto_reminders: false,
                link_meta: {notify_url: process.env.NOTIFY_URL, return_url: `https://wa.me/+91${process.env.RETURN_NUMBER}`},
            }
        };

        axios
            .request(options)
            .then((data) => {
                client.sendMessage(message.from, `You can pay on this link :)\n${data.data.link_url}`)
                return;
            })
            .catch((error) => {
                console.log(error)
                client.sendMessage(message.from, `Error creating payment link, Try again!`)
                return;
            })
    } catch (error) {
        console.log(error)
        client.sendMessage(message.from, "There was a problem while creating a link!");
        return;
    }
}

module.exports = paymentHandler