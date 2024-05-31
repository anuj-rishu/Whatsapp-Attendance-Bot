import { ApiHandler } from "sst/node/api";
import Main from "@my-sst-app/core/recievemessage/index"

export const handler = ApiHandler(async(evt) => {
  
  await Main(JSON.parse(evt.body!))
  return {
    statusCode: 200,
  };
});
