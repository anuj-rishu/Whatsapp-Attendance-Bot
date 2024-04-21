const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')
const axios = require('axios').default;
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

/**
 * @param {MessageType} message - The message to check.
 * @returns {Promise<[boolean, number]>}
 */
const checkSpam = async (message) => {
    const value = Number(await client.get(message.payload.source))
    if (value !== null && value !== 0) {
        if (value <= 20) {
            await client.incr(message.payload.source)
            return {
                isSpam: false,
                value: value + 1
            }
        }
        else if (value > 20 && value < 25) {
            await client.incrby(message.payload.source, 2)
            await SendMessage({ to: message.payload.source, message: "There is a rate limit, Please do not send any more messages in this day or you will get banned!!!" })
            return {
                isSpam: false,
                value: value + 2
            }
        }
        else {
            await blockUser(message.payload.source)
            // client.disconnect()
            return {
                isSpam: true,
                value: 26
            }
        }
    }
    else {
        await client.setex(message.payload.source, 86400, 1)
        return {
            isSpam: false,
            value: 1
        }
    }
};

const blockUser = async (phone) => {
    const data = new URLSearchParams();
    data.append('phone', phone);
    data.append('block', 'true');
    try {
        const res = await axios.put(`${process.env.BLOCK_URL}/${process.env.GUPSHUP_APP_NAME}`, data, {
            headers: {
                'apikey': process.env.GUPSHUP_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return res.data
    } catch (error) {
        await SendMessage({ to: process.env.MY_PHONE, message: `Block this number: ${phone} !!!` })
    }
}

module.exports = checkSpam, { blockUser }