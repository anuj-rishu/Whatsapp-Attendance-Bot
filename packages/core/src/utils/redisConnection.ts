import { get } from 'http';
import { connect } from 'http2';
import { Redis } from 'ioredis';
import { Config } from "sst/node/config";

// const client = new Redis({
//   host: Config.REDIS_HOST,
//   port: parseInt(Config.REDIS_PORT!),
//   password: Config.REDIS_PASSWORD,
// });

const client = {
  get: (key: string) => {
    return
  },
  incr: (key: string) => {
    return
  },
  incrby: (key: string, value: number) => {
    return
  },
  setex: (key: string, time: number, value: number) => {
    return
  },
  connect: () => {
    return new Promise((resolve) => {resolve("hello")})
  },
  disconnect: () => {
    return new Promise((resolve) => {resolve("hello")})
  }
}

export default client;