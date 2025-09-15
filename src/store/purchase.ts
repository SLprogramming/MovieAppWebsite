import { create } from "zustand";
import api from "../axios";
import type { User } from "./user";

export interface PaymentType {
  _id: string;
  name: string;
}

export interface PremiumPackage {
  _id: string;
  name: string;
  durationDays: number;
  price: number;
  currency: string;
  description: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export type PaymentPlatform = PaymentType & {
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export interface PaymentAccount {
  _id: string;
  name: string;
  isActive: boolean;
  accNumber: string;
  paymentType_id: PaymentType;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
type Image = {
  url: string;
  public_id: string;
};

type PurchaseRequest = {
  _id: string;
  user_id: User;
  plan_id: PremiumPackage;
  bankAccount_id?: PaymentAccount & {paymentType_id:string}; // if populated, make another type for BankAccount
  img: Image;
  status: "pending" | "approved" | "rejected";
  transitionNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};


type PurchaseStoreState = {
  plans: PremiumPackage[];
  paymentPlatforms: PaymentPlatform[];
  paymentAccounts: PaymentAccount[];
  purchaseHistory: PurchaseRequest[];
  fetchPlans: () => Promise<void>;
  fetchPlatforms: () => Promise<void>;
  fetchAccounts: (id: string) => Promise<void>;
  fetchPurchaseRequest: (id: string) => Promise<void>;
};

export const usePurchaseStore = create<PurchaseStoreState>()((set) => ({
  plans: [],
  paymentPlatforms: [],
  paymentAccounts: [],
  purchaseHistory:[],
  fetchPlans: async () => {
    try {
      let res = await api.get("plan/get-all");
      if (res.data.success) {
        set({ plans: res.data.data });
      }
    } catch (error) {}
  },
  fetchPlatforms: async () => {
    try {
      let res = await api.get("payment/get-all");
      if (res.data.success) {
        set({ paymentPlatforms: res.data.data });
      }
    } catch (error) {}
  },
  fetchAccounts: async (id) => {
    try {
      let res = await api.get("bankAccount/getByPayment/" + id);
      if (res.data.success) {
        set({ paymentAccounts: res.data.data });
      }
    } catch (error) {}
  },
  fetchPurchaseRequest : async (id) => {
    try {
      
          let res = await api.get('purchase/getByUser/'+id)
          if(res.data.success){
            console.log(res.data.data)
            set({purchaseHistory:res.data.data})
          }
    } catch (error) {
      
    }
  }
}));
