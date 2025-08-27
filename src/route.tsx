import type { RouteObject } from "react-router-dom"; // `type` only import
import Index from "./pages/IndexPage";
import Login from "./pages/LoginRegister";
import Home from "./pages/Home";
import {PublicOnlyRoute,AuthRedirect, ActivateRoute} from "./protectRoute"
import Content from "./pages/Content";
import Detail from "./pages/Detail";
import Activate from "./pages/Activate";


export const routes: RouteObject[] = [
  { path: "/", element: <Index />,
    children:[
      {index:true,element:(
        <AuthRedirect>
          <Home/>
        </AuthRedirect>
      )},
      {path:'/movie',element:(
        <AuthRedirect>
          <Content key={'movie'} content="movie"/>
        </AuthRedirect>
      )},
      {path:'/serie',element:(
        <AuthRedirect>
          <Content key={'tv'} content="tv"/>
        </AuthRedirect>
      )},
    ]

   }, 
  {path:"/login",element: (
    <PublicOnlyRoute>
      <Login/>
    </PublicOnlyRoute>
  )},
  {path:"/activate",element: (
    <ActivateRoute>
      <Activate/>
    </ActivateRoute>
  )},
   {path:'/detail/:id',element:(
        <AuthRedirect>
          <Detail/>
        </AuthRedirect>
      )},
];
