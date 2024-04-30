import MessageType from "../../types/message";
import SendMessage  from '../../utils/SendMessage';
import client from '../../utils/redisConnection';
import { Config } from "sst/node/config";

const suggestHandler = async (message: MessageType) => {
    const pattern = /\/suggest\s+(.+)/i;
    const match = message.payload.payload.text?.match(pattern);
    if(match === null || match === undefined){
        client.incr(message.payload.source)
        // await client.disconnect()
        await SendMessage({to: message.payload.source, message: `Type:\n*/suggest* {Your Suggestion}`})
        return;
    }
    else if (match) {
        const response = match[1];
        let prefix = "Suggestion: "
        client.incrby(message.payload.source, 2)
        // await client.disconnect()
        await SendMessage({to: Config.MY_PHONE!, message: prefix += response})
        await SendMessage({to: message.payload.source, message: `Your suggestion was submitted!`})
        return;
    }
}

export default suggestHandler