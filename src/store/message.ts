import { create } from "zustand";
import socketApi from "../liveChatAxios.ts";
import { formatApiResponseMessage } from "../tools/helper.ts";

export interface IUser {
  _id: string;
  name: string;
  role: "user" | "admin" | "superAdmin";
}

export type ConversationStatus = "pending" | "progress" | "finish";

export interface IConversation {
  _id: string;
  status: ConversationStatus;
  lastMessage?: string;
  request_user_id: IUser;          // always populated
  response_user_id: IUser | null;  // null OR populated user

  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IMessageFile {
  publicID: string | null;
  url: string | null;
}
export type MessageStatus = "sending" | "sent" | "seen";

export interface IMessage {
  _id: string;
  client_id:string;
  sender_id: IUser;          // ObjectId string
  conversation_id: string;    // ObjectId string

  status: MessageStatus;
  message: string;
  file: IMessageFile;

  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type ChatMessage = {
  id: string | null;
  text?: string;
  fileName: string | null;
  sender_id:string; // extend if needed
  timestamp: string;
  status:MessageStatus
};



type MessageStoreState = {
  messages: ChatMessage[];
  conversations:IConversation[];
  fetchConversation: (userId:string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  updateMessage:(message: IMessage) => void;
  updateMessageWithID:(message: IMessage) => void;
  addConversation: (conversation: IConversation) => void;
};

export const useMessageStore = create<MessageStoreState>()((set) => ({
    messages: [],
    conversations: [],
    fetchConversation: async (userId:string) => {
      try {
        const response = await socketApi.get(`/conversations/get-by-user/${userId}`);
       
        set({ conversations: response.data?.conversations.filter((conv: IConversation) => conv.status !== "finish") });
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    },
    fetchMessages: async (conversationId: string) => {
      try {
        const response = await socketApi.get(`/messages/get-messages/${conversationId}`);
        let messages: ChatMessage[] =  formatApiResponseMessage(response?.data?.messages)
        console.log("Fetched messages:", messages);
        set({ messages });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },
    addMessage: (message: ChatMessage) => {
      console.log('hello')
      set((state) => ({
        messages: [...state.messages, message],
      }));
    },
    updateMessage:(message:IMessage) =>{
      set(state => {
        let updatedMessages = state.messages.map(msg => {
         return msg.id === message?.client_id ?  formatApiResponseMessage([message])[0] : msg
         
          
        })
        return ({messages:updatedMessages})
      })
    },
     updateMessageWithID:(message:IMessage) =>{
      set(state => {
        let updatedMessages = state.messages.map(msg => {
         return msg.id === message?._id ?  formatApiResponseMessage([message])[0] : msg
         
          
        })
        return ({messages:updatedMessages})
      })
    },
    addConversation: (conversation: IConversation) => {
      set({conversations:[conversation]});
    }

}));
