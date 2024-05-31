import { ApiHandler } from "sst/node/api";
import Main from "@my-sst-app/core/recievemessage/index"

export const handler = ApiHandler(async(evt) => {
  
  Main(JSON.parse(evt.body!))
  console.log(evt.body)
  return {
    statusCode: 200,
  };
});
