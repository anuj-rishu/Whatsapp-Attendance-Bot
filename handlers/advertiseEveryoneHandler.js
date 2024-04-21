const Update = require("../models/Update")
const SendMessage = require('../utils/sendMessage');
const client = require('../utils/redisConnection.js')

const advertiseEveryone = async (message) => {
    const pattern = /\/everyone\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        client.incr(message.payload.source)
        // await client.disconnect()
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
        //                 client.incr(message.payload.source)
        //                 await client.disconnect()
        //                 client.sendMessage(people.from, messagetosend)
        //             });
        //             return;
        //         }
        //     })
        // }
        // else{
            peoples.forEach(async (people) => {
                const messagetosend = `${match[1]}`
                // client.incr(people.from)
                await SendMessage({to: people.from, message: messagetosend})
            });
            // await client.disconnect()
            return;
        // }
    }
}

module.exports = advertiseEveryone