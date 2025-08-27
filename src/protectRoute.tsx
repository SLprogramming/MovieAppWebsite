import {  type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./store/user";




type RouteProps = {
    children:ReactNode,
}



export const AuthRedirect = ({ children } : RouteProps) => {
     const authStore = useAuthStore()
     const activateToken = localStorage.getItem('activateToken') || authStore.activateToken
     if(activateToken){
      return <Navigate to={"/activate"} replace />
     }
   if(!authStore.user && !authStore.isChecking){
     return <Navigate to={"/login"} replace />
   }
  return <>{children}</>;
};

export const PublicOnlyRoute = ({ children }:RouteProps) => {
     const authStore = useAuthStore()
        const activateToken = localStorage.getItem('activateToken') || authStore.activateToken
      if(activateToken){
      return <Navigate to={"/activate"} replace />
     }
     if(authStore.user && !authStore.isChecking){
     return <Navigate to={"/"} replace />
   }
   return <>{children}</>;
}
export const ActivateRoute = ({ children }:RouteProps) => {
     const authStore = useAuthStore()
        const activateToken = localStorage.getItem('activateToken') || authStore.activateToken
      if(!activateToken){
      return <Navigate to={"/login"} replace />
     }
   
   return <>{children}</>;
}

