const Update = require("../models/Update")
const SendMessage = require('../utils/sendMessage');
const connection = require('../utils/redisConnection.js')

const advertiseEveryone = async (value, message) => {
    const rclient = connection.Client;
    const pattern = /\/everyone\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        await SendMessage({to: message.payload.source, message: `Type:\n*/Everyone {Your Message}*`})
        return;
    }
    const peoples = await Update.find({__v: 0})
    if(peoples){
        // if(message.hasMedia){
        //     message.downloadMedia().then((media)=>{
        //         if(media){
        //             const mediatosend = new MessageMedia(media.mimetype, media.data);
        //             peoples.forEach(people => {
        //                 client.sendMessage(people.from, mediatosend, {caption: match[1]})
        //             });
        //         }
        //         else{
        //             peoples.forEach(people => {
        //                 const messagetosend = `${match[1]}`
        //                 rclient.set(message.payload.source, value + 1, { XX: true })
        //                 await rclient.disconnect()
        //                 client.sendMessage(people.from, messagetosend)
        //             });
        //             return;
        //         }
        //     })
        // }
        // else{
            peoples.forEach(async (people) => {
                const messagetosend = `${match[1]}`
                // rclient.set(people.from, value + 1, { XX: true })
                await SendMessage({to: people.from, message: messagetosend})
            });
            await rclient.disconnect()
            return;
        // }
    }
}

module.exports = advertiseEveryone