import { create } from "zustand";
import socketApi from "../liveChatAxios.ts";

export interface IUser {
  _id: string;
  name: string;
  role: "user" | "admin" | "superAdmin";
}

export type ConversationStatus = "pending" | "progress" | "closed";

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

  sender_id: IUser;          // ObjectId string
  conversation_id: string;    // ObjectId string

  status: MessageStatus;
  message: string;
  file: IMessageFile;

  createdAt: string;
  updatedAt: string;
  __v?: number;
}



type MessageStoreState = {
  messages: IMessage[];
  conversation:IConversation[];
  fetchConversation: (userId:string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (message: IMessage) => void;
};

export const useMessageStore = create<MessageStoreState>()((set) => ({
    messages: [],
    conversation: [],
    fetchConversation: async (userId:string) => {
      try {
        const response = await socketApi.get(`/conversations/get-by-user/${userId}`);
        set({ conversation: response.data?.conversations });
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    },
    fetchMessages: async (conversationId: string) => {
      try {
        const response = await socketApi.get(`/messages/get-messages/${conversationId}`);
        set({ messages: response.data?.messages });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },
    addMessage: (message: IMessage) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    },

}));
