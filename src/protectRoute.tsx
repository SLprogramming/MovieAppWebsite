import {  type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/user";




type RouteProps = {
    children:ReactNode,
}



export const AuthRedirect = ({ children } : RouteProps) => {
     const authStore = useAuthStore()
   if(!authStore.user){
     return <Navigate to={"/login"} replace />
   }
  return <>{children}</>;
};

export const PublicOnlyRoute = ({ children }:RouteProps) => {
     const authStore = useAuthStore()
     if(authStore.user){
     return <Navigate to={"/"} replace />
   }
   return <>{children}</>;
}