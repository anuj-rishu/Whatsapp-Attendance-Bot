import { StackContext, Api, Cron, Config } from "sst/constructs";

export function API({ stack }: StackContext) {
  const MONGODB_URI = new Config.Secret(stack, "MONGODB_URI");
  const REDIS_PASSWORD = new Config.Secret(stack, "REDIS_PASSWORD");
  const REDIS_HOST = new Config.Secret(stack, "REDIS_HOST");
  const REDIS_PORT = new Config.Secret(stack, "REDIS_PORT");
  const GUPSHUP_KEY = new Config.Secret(stack, "GUPSHUP_KEY");
  const GUPSHUP_FROM_NUMBER = new Config.Secret(stack, "GUPSHUP_FROM_NUMBER");
  const MY_PHONE = new Config.Secret(stack, "MY_PHONE");
  const BOT_PHONE = new Config.Secret(stack, "BOT_PHONE");
  const MY_MAILID = new Config.Secret(stack, "MY_MAILID");
  const RETURN_NUMBER = new Config.Secret(stack, "RETURN_NUMBER");
  const NOTIFY_URL = new Config.Secret(stack, "NOTIFY_URL");

  const GUPSHUP_APP_NAME = new Config.Parameter(stack, "GUPSHUP_APP_NAME", {
    value: "botsrm",
  });
  const SEND_URL = new Config.Parameter(stack, "SEND_URL", {
    value: "https://api.gupshup.io/sm/api/v1/msg",
  });
  const BLOCK_URL = new Config.Parameter(stack, "BLOCK_URL", {
    value: "https://api.gupshup.io/sm/api/v1/app/block",
  });
  const WHATS_MESS_URL = new Config.Parameter(stack, "WHATS_MESS_URL", {
    value:
      "https://script.googleusercontent.com/macros/echo?user_content_key=p5cklRNXWqi8NKcBoI0oNyW0zsURynoPECjci_BvwG055TRnaj6zhWFv6CdsNH6aEZn20zgw2ChdNkk80LkEQQCnvUe1ZxWyOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa8J4NQyrVEFMtB0_KJVYuOT_3bQKrHo7NkqtUPg2gdSiiSDTapmBxaiEQCVX2MjV4g-KpqedECJYHF0hyHl7ss-YBYggDTTSTEJjikwa16IO-sxGS-3BWS1id3ZL8DJkJg&lib=ME6R_9-iwVkE5ZAWFx9_jKCyrCrPpogKk",
  });
  const SRM_DO_URL = new Config.Parameter(stack, "SRM_DO_URL", {
    value: "https://academia-s-2.azurewebsites.net/do",
  });
  const SRM_TOKEN_URL = new Config.Parameter(stack, "SRM_TOKEN_URL", {
    value: "https://academia-s-2.azurewebsites.net/login",
  });
  const SRM_USER_URL = new Config.Parameter(stack, "SRM_USER_URL", {
    value: "https://academia-s-2.azurewebsites.net//course-user",
  });
  const FRIEND_FREE_TIME = new Config.Parameter(stack, "FRIEND_FREE_TIME", {
    value: '62',
  });
  const NORMAL_FREE_TIME = new Config.Parameter(stack, "NORMAL_FREE_TIME", {
    value: '31',
  });
  const TIME_TO_INCREASE = new Config.Parameter(stack, "TIME_TO_INCREASE", {
    value: '31',
  });

  const api = new Api(stack, "api", {
    routes: {
      "POST /recievemessage": "packages/functions/src/recievemessage.handler",
    },
  });

  api.bind([
    MONGODB_URI,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_PORT,
    GUPSHUP_KEY,
    GUPSHUP_FROM_NUMBER,
    MY_PHONE,
    BOT_PHONE,
    MY_MAILID,
    RETURN_NUMBER,
    NOTIFY_URL,
    GUPSHUP_APP_NAME,
    SEND_URL,
    BLOCK_URL,
    WHATS_MESS_URL,
    SRM_DO_URL,
    SRM_TOKEN_URL,
    SRM_USER_URL,
    TIME_TO_INCREASE,
    NORMAL_FREE_TIME,
    FRIEND_FREE_TIME
  ]);

  // const cron = new Cron(stack, "cron", {
  //   schedule: "cron(30 7,12 ? 1-5,7-12 MON-SAT *)", // run mon-sat at 12:30 and 5:30 pm IST from jan to may and july to dec
  //   job: "packages/functions/src/cron/update.handler",
  // });

  // cron.bind([
  //   MONGODB_URI,
  //   REDIS_PASSWORD,
  //   REDIS_HOST,
  //   REDIS_PORT,
  //   GUPSHUP_KEY,
  //   GUPSHUP_FROM_NUMBER,
  //   MY_PHONE,
  //   BOT_PHONE,
  //   MY_MAILID,
  //   RETURN_NUMBER,
  //   NOTIFY_URL,
  //   GUPSHUP_APP_NAME,
  //   SEND_URL,
  //   BLOCK_URL,
  //   WHATS_MESS_URL,
  //   SRM_DO_URL,
  //   SRM_TOKEN_URL,
  //   SRM_USER_URL,
  //   TIME_TO_INCREASE,
  //   NORMAL_FREE_TIME,
  //   FRIEND_FREE_TIME
  // ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
