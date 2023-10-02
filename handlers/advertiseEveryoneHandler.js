const Update = require("../models/Update")
const { MessageMedia } = require('whatsapp-web.js');

const advertiseEveryone = async (client, message) => {
    const peoples = await Update.find({__v: 0})
    const pattern = /\/everyone\s+(.+)/i;
    const match = message.body.match(pattern);
    if(match === null){
        client.sendMessage(message.from, `Type:\n*/Everyone {Your advertisment}*`)
        return;
    }
    if(peoples){
        if(message.hasMedia){
            message.downloadMedia().then((media)=>{
                if(media){
                    const mediatosend = new MessageMedia(media.mimetype, media.data);
                    peoples.forEach(people => {
                        client.sendMessage(people.from, mediatosend, {caption: match[1]})
                    });
                }
                else{
                    peoples.forEach(people => {
                        const messagetosend = `Advertisment: \n${match[1]}`
                        client.sendMessage(people.from, messagetosend)
                    });
                    return;
                }
            })
        }
        else{
            peoples.forEach(people => {
                const messagetosend = `Advertisment: \n${match[1]}`
                client.sendMessage(people.from, messagetosend)
            });
            return;
        }
    }
    else{
        client.sendMessage(message.from, "No one to send message to :(");
        return;  
    }
}

module.exports = advertiseEveryone