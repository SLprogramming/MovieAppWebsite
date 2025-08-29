import { create } from "zustand";
import api from "../axios";
import type {
  LoginFormInputType,
  RegisterFormInputType,
} from "../pages/LoginRegister";
import { toast } from "react-toastify";
import type { Dispatch, SetStateAction } from "react";
import { useContentStore } from "./content";

export interface User {
  _id: string;
  name: string;
  email: string;
  premiumExpire: string; // ISO date string
  password: string;
  role: "user" | "admin"; // if you expect only these roles
  isVerified: boolean;
  bookmarksMovies: string[]; // or maybe Movie[] if you have a Movie type
  favoritesMovies: string[];
  bookmarksTV: string[];
  favoritesTV: string[];
  recentMovies: string[];
  recentTV: string[];
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
  login: (payload: LoginFormInputType) => Promise<void>;
  register: (payload: RegisterFormInputType) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  fetchMe: () => Promise<void>;
  ActivationTimer: () => void;
  contentListToggle: ({
    type,
    flag,
    id,
    isAdd,
  }: {
    type: "favorite" | "bookmark" | 'recent';
    flag: "movie" | "tv";
    id: number;
    isAdd:boolean
  }) => Promise<any>;
  activateAccount: (
    {
      activation_token,
      activation_code,
    }: { activation_token: string; activation_code: string },
    setSuccess: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
}


export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  activateToken: null,
  isChecking: true,
  premiumIn: 0,
  setToken: (token) => set({ accessToken: token }),
  

  login: async ({ email, password }) => {
    const { data } = await api.post("auth/login", { email, password });
    set({ user: data.user, accessToken: data.accessToken });
  },
  register: async ({ name, email, password }) => {
    const { data } = await api.post("auth/register", { name, email, password });
    set({ activateToken: data.activationToken });
    localStorage.setItem("activateExpireIn", data.expireIn);
    localStorage.setItem("activateToken", data.activationToken);
    // console.log(data);
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
      // console.log(data);
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
    await api.post("/auth/logout");
    set({ user: null, accessToken: null });
  },

  fetchMe: async () => {
      
const {setSpecialContent} = useContentStore.getState()
    set({ isChecking: true });
    try {
      const { data } = await api.get("/auth/info");
      set({ user: data.user });
      let {bookmarksMovies,bookmarksTV,favoritesMovies,favoritesTV,recentMovies,recentTV} = data.content
      setSpecialContent({content:'movie',key:'bookmark',data:bookmarksMovies})
      setSpecialContent({content:'movie',key:'favorite',data:favoritesMovies})
      setSpecialContent({content:'tv',key:'favorite',data:favoritesTV})
      setSpecialContent({content:'tv',key:'bookmark',data:bookmarksTV})
      setSpecialContent({content:'tv',key:'recent',data:recentTV})
      setSpecialContent({content:'movie',key:'recent',data:recentMovies})
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
  const addSpecialContent = useContentStore.getState().addSpecialContent
  const removeSpecailContent = useContentStore.getState().removeSpecailContent

  try {
    type UserContentKey =
      | "bookmarksMovies"
      | "favoritesMovies"
      | "bookmarksTV"
      | "favoritesTV"
      | "recentTV"
      | "recentMovies";

    const state = get();

    if (!state.user) return; // no logged-in user

    let keyData: UserContentKey;
    if (type === "bookmark") {
      keyData = flag === "movie" ? "bookmarksMovies" : "bookmarksTV";
    }else if( type == 'recent'){
     keyData = flag === "movie" ? "recentMovies" : "recentTV";
    } else {
      keyData = flag === "movie" ? "favoritesMovies" : "favoritesTV";
    }

    if (isAdd) {
      // Call API for adding
      let response = await api.put("user/add-bookmarks-favorate", {
        type,
        flag,
        id,
      });

      if (response.data.success) {
        set({
          user: {
            ...state.user,
            [keyData]: [...state.user[keyData], id.toString()],
          },
        });
        addSpecialContent({content:flag , key:type ,data:response.data.data})
        return {success:true,message:'bookmark add successfully'}
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
            [keyData]: state.user[keyData].filter(
              (item) => item.toString() !== id.toString()
            ),
          },
        });
        removeSpecailContent({content:flag , key:type ,id})
         return {success:true,message:'bookmark remove successfully'}
      }
    }
  } catch (error) {
     return {success:false,message:`bookmark ${isAdd ? 'add' :'remove'} fail`}
    console.error("Failed to update content list", error);
  }
},

 
}));
