type MessageType = {
  app: string;
  timestamp: number;
  version: number;
  type: "text" | "image" | "file" | "audio" | "video" | "contact" | "location" | "button_reply" | "list_reply";
  payload: {
      id: string;
      source: string;
      type: string;
      payload: {
          text?: string; // optional since it depends on the type property
      };
      sender: {
          phone: string;
          name: string;
          country_code: string;
          dial_code: string;
      };
  };
};

export default MessageType;