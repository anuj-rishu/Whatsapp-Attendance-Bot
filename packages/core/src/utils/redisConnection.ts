import { Redis } from 'ioredis';
import { Config } from "sst/node/config";

const client = new Redis({
  host: Config.REDIS_HOST,
  port: parseInt(Config.REDIS_PORT!),
  password: Config.REDIS_PASSWORD,
});

export default client;