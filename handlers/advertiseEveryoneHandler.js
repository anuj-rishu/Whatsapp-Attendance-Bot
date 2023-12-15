const Update = require("../models/Update")

const advertiseEveryone = async (rclient, message) => {
    const pattern = /\/everyone\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        rclient.set(message.payload.source, value + 1, { XX: true })
        await rclient.disconnect()
        // client.sendMessage(message.from, `Type:\n*/Everyone {Your Message}*`)
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
                rclient.set(people.from, value + 1, { XX: true })
                // client.sendMessage(people.from, messagetosend)
            });
            await rclient.disconnect()
            return;
        // }
    }
    else{
        return;  
    }
}

module.exports = advertiseEveryone