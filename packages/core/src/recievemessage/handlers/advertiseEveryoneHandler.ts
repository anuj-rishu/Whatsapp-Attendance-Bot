import MessageType from "../../types/message";
import Update from "../../models/Update";
import SendMessage from "../../utils/SendMessage";
import client from "../../utils/redisConnection";

const advertiseEveryone = async (message: MessageType) => {
  const pattern = /\/everyone\s+(.+)/i;
  const match = message.payload.payload.text?.match(pattern);
  if (match === null || match === undefined) {
    client.incr(message.payload.source);
    // await client.disconnect()
    await SendMessage({
      to: message.payload.source,
      message: `Type:\n*/Everyone {Your Message}*`,
    });
    return;
  }
  const peoples = await Update.find({ __v: 0 });
  if (peoples) {
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
      const messagetosend = `${match[1]}`;
      // client.incr(people.from)
      await SendMessage({ to: people.from, message: messagetosend });
    });
    // await client.disconnect()
    return;
    // }
  }
};

export default advertiseEveryone;
