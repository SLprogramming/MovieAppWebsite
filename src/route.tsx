import type { RouteObject } from "react-router-dom"; // `type` only import
import Index from "./pages/IndexPage";
import Login from "./pages/LoginRegister";
import Home from "./pages/Home";

export const routes: RouteObject[] = [
  { path: "/", element: <Index />,
    children:[
      {index:true,element:<Home/>}
    ]

   }, 
  {path:"/login",element: <Login/>}
];
