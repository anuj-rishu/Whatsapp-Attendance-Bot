const { createClient } = require('redis');

class RedisClient {
    constructor() {
        this.Client = null;
    }

    async connect() {
        this.Client = createClient({
            password: process.env.REDIS_PASS,
            socket: {
                host: 'redis-16896.c264.ap-south-1-1.ec2.cloud.redislabs.com',
                port: 16896
            }
        });
        await this.Client.connect()
        console.log("Redis Client Connected")
        return this.Client;
    }
}

const connection = new RedisClient()
// connection.connect()
module.exports = connection;