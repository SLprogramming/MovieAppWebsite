import { create } from "zustand";
import api from "../axios";
import type { LoginFormInputType, RegisterFormInputType } from "../pages/LoginRegister";

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
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  activateToken:string | null ;
  isChecking: boolean;
  login: (payload: LoginFormInputType) => Promise<void>;
  register:(payload :RegisterFormInputType) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  fetchMe: () => Promise<void>;
  ActivationTimer:() => void;
  activateAccount:({activation_token,activation_code} : {activation_token:string,activation_code:string}) => Promise<void>
}
 
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  activateToken: null,
  isChecking: true,

  setToken: (token) => set({ accessToken: token }),

  login: async ({ email, password }) => {
    const { data } = await api.post("auth/login", { email, password });
    set({ user: data.user, accessToken: data.accessToken });
  },
  register:async ({name,email,password}) => {
    const {data} = await api.post('auth/register',{name,email,password})
    set({activateToken:data.activationToken})
    localStorage.setItem('activateExpireIn',data.expireIn)
    localStorage.setItem('activateToken',data.activationToken)
    console.log(data)

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

  activateAccount:async (payload) => {
    try {
      let {data} = await api.post('auth/activate-user',payload)
      console.log(data)
      if(data.success){
         set({ activateToken: null });
        localStorage.removeItem("activateExpireIn");
        localStorage.removeItem("activateToken");
        
      }

    } catch (error) {
      
    }

  },


  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null, accessToken: null });
  },

  fetchMe: async () => {
      set({ isChecking: true });
    try {

      const { data } = await api.get("/auth/info");
      set({ user: data.user });
    } catch {
      set({ user: null, accessToken: null });
        setTimeout(() => {
            set({ isChecking: false });
        },1000)
    } finally {
        setTimeout(() => {
            set({ isChecking: false });
        },100)
      
    }
  },
}));
