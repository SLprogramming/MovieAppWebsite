import { create } from "zustand";
import api from "../axios";
import type {
  LoginFormInputType,
  RegisterFormInputType,
} from "../pages/LoginRegister";
import type { Dispatch, SetStateAction } from "react";
import { type MovieContentType, type TVContentType } from "./content";

export interface SpecialContentsType {
  type: "movie" | "tv";
  id: number;
}
export interface UserSession {
  _id: string; // MongoDB ObjectId as string
  device: string; // user-agent or device info
  token: string; // refresh token
  createdAt: string; // ISO date string
}
export interface User {
  _id: string;
  name: string;
  email: string;
  premiumExpire: string; // ISO date string
  password: string;
  role: "user" | "admin"; // if you expect only these roles
  sessions: UserSession[];
  isVerified: boolean;
  bookmark: SpecialContentsType[]; // or maybe Movie[] if you have a Movie type
  favorite: SpecialContentsType[];
  recent: SpecialContentsType[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  activateToken: string | null;
  isChecking: boolean;
  premiumIn: number;
  bookmark: (MovieContentType | TVContentType)[];
  favorite: (MovieContentType | TVContentType)[];
  recent: (MovieContentType | TVContentType)[];

  login: (payload: LoginFormInputType) => Promise<any>;
  register: (payload: RegisterFormInputType) => Promise<any>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  fetchMe: ({ checking }: { checking: boolean }) => Promise<void>;
  ActivationTimer: () => void;
  contentListToggle: ({
    type,
    flag,
    id,
    isAdd,
  }: {
    type: "favorite" | "bookmark" | "recent";
    flag: "movie" | "tv";
    id: number;
    isAdd: boolean;
  }) => Promise<any>;
  removeSession:({sessionId}:{sessionId:string}) => Promise<any>;
  activateAccount: (
    {
      activation_token,
      activation_code,
    }: { activation_token: string; activation_code: string },
    setSuccess: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
  fetchSpecialContent: ({
    key,
  }: {
    key: "bookmark" | "favorite" | "recent";
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  activateToken: null,
  isChecking: true,
  premiumIn: 0,
  bookmark: [],
  favorite: [],
  recent: [],

  setToken: (token) => set({ accessToken: token }),

  login: async ({ email, password }) => {
    const { data, status } = await api.post("auth/login", { email, password });
    console.log(status);

    let premiumExpire =
      new Date(data?.user?.premiumExpire).getTime() - Date.now();
    set({
      user: data.user,
      accessToken: data.accessToken,
      premiumIn: premiumExpire,
    });
    return data
  },
  register: async ({ name, email, password }) => {
    const { data } = await api.post("auth/register", { name, email, password });
    set({ activateToken: data.activationToken });
    localStorage.setItem("activateExpireIn", data.expireIn);
    localStorage.setItem("activateToken", data.activationToken);
    // console.log(data);
    return data
  },
  ActivationTimer: () => {
    let expireIn = localStorage.getItem("activateExpireIn") as string;

    if (expireIn) {
      let expireAt = parseInt(expireIn, 10); // absolute expiry timestamp
      let now = Date.now();
      let remaining = expireAt - now; // ms left

      console.log("Expire At:", expireAt, "Now:", now, "Remaining:", remaining);

      if (remaining > 0) {
        setTimeout(() => {
          set({ activateToken: null });
          localStorage.removeItem("activateExpireIn");
          localStorage.removeItem("activateToken");
        }, remaining);
      } else {
        // already expired
        set({ activateToken: null });
        localStorage.removeItem("activateExpireIn");
        localStorage.removeItem("activateToken");
      }
    }
  },

  activateAccount: async (payload, setSuccess) => {
    try {
      let { data } = await api.post("auth/activate-user", payload);

      if (data.success) {
        set({ activateToken: null });
        localStorage.removeItem("activateExpireIn");
        localStorage.removeItem("activateToken");
        // toast.success('Account activation success. Please Login again')
        setSuccess(true);
      }
    } catch (error) {}
  },

  logout: async () => {
    await api.get("/auth/logout");
    set({
      user: null,
      accessToken: null,
      premiumIn: 0,
      bookmark: [],
      favorite: [],
      recent: [],
    });
  },

  fetchMe: async ({ checking }) => {
    const state = get();
    // const {setSpecialContent} = useContentStore.getState()
    set({ isChecking: checking });
    try {
      const { data } = await api.get("/auth/info");

      set({
        ...state,
        user: data.user,
      });

      if (data?.user?.premiumExpire) {
        let premiumExpire =
          new Date(data?.user?.premiumExpire).getTime() - Date.now();
        set({ premiumIn: premiumExpire });
      }
    } catch {
      set({ user: null, accessToken: null });

      set({ isChecking: false });
    } finally {
      set({ isChecking: false });
    }
  },
  contentListToggle: async ({ type, flag, id, isAdd = true }) => {
    try {
      const state = get();

      if (!state.user) return; // no logged-in user

      if (isAdd) {
        // Call API for adding
        let response = await api.put("user/add-bookmarks-favorate", {
          type,
          flag,
          id,
        });

        let currentList = state[type].filter(
          (e) =>
            !(e.id == id && ("release_date" in e ? "movie" : "tv") === flag)
        );

        let updatedList = [...currentList, response.data.data];
        if (updatedList.length > 20 && type == "recent") {
          updatedList = updatedList.slice(-20);
          console.log("updatedlist", updatedList);
        }
        console.log("updatedlist", updatedList);
        if (response.data.success) {
          set({
            user: {
              ...state.user,
              [type]: [
                ...state.user[type].filter(
                  (e) => !(e.id == id && e.type == flag)
                ).slice(-19),
                { type: flag, id },
              ],
            },

            [type]: updatedList,
          });
          // useContentStore.getState().addSpecialContent({content:flag , key:type ,data:response.data.data})

          return { success: true, message: "bookmark add successfully" };
        }
      } else {
        // Call API for removing
        let response = await api.put("user/remove-bookmarks-favorate", {
          type,
          flag,
          id,
        });

        if (response.data.success) {
          set({
            user: {
              ...state.user,
              [type]: state.user[type].filter(
                (item) => !(item.id == id && item.type == flag)
              ),
            },

            [type]: state[type].filter((e) => e.id != id),
          });
          // removeSpecailContent({content:flag , key:type ,id})
          return { success: true, message: "bookmark remove successfully" };
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `bookmark ${isAdd ? "add" : "remove"} fail`,
      };
      console.error("Failed to update content list", error);
    } finally {
      // console.log(useContentStore.getState())
    }
  },
  removeSession:async({sessionId}) => {
    try {
      let res = await api.post('/user/remove/session',{sessionId})
      return res
    } catch (error) {
        return error
    }
  },
  fetchSpecialContent: async ({ key }) => {
    try {
      // console.log('fetching special contetn')
      const state = get();

      let url = `content/get/${key}`;
      let { data } = await api.get(url);
      if (data.success) {
        set({
          ...state,

          [key]: data.data,
        });
      }
      // console.log(key)
    } catch (error) {}
  },
}));
