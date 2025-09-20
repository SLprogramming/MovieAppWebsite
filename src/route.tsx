import type { RouteObject } from "react-router-dom"; // `type` only import
import Index from "./pages/IndexPage";
import Login from "./pages/LoginRegister";
import Home from "./pages/Home";
import {PublicOnlyRoute,AuthRedirect, ActivateRoute} from "./protectRoute"
import Content from "./pages/Content";
import Detail from "./pages/Detail";
import Activate from "./pages/Activate";
import Bookmarks from "./pages/Bookmarks";
import Search from "./pages/Search";
import Genres from "./pages/Genres";
import GenreContent from "./pages/GenreContent";
import BuyVip from "./pages/BuyVip";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";


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
      {path:'/bookmark',element:(
        <AuthRedirect>
          <Bookmarks key={'bookmark'} contentType="bookmark"/>
        </AuthRedirect>
      )},
      {path:'/recent',element:(
        <AuthRedirect>
          <Bookmarks key={'recent'} contentType="recent"/>
        </AuthRedirect>
      )},
      {path:'/favorite',element:(
        <AuthRedirect>
          <Bookmarks key={'favorite'} contentType="favorite"/>
        </AuthRedirect>
      )},
      {path:'/search',element:(
        <AuthRedirect>
          <Search key={'search'} />
        </AuthRedirect>
      )},
      {path:'/genre',element:(
        <AuthRedirect>
          <Genres key={'genre'} />
        </AuthRedirect>
      )},
      {path:'/content',element:(
        <AuthRedirect>
          <GenreContent key={'genreContent'} />
        </AuthRedirect>
      )},
      {path:'/purchase',element:(
        <AuthRedirect>
          <BuyVip key={'buyvip'} />
        </AuthRedirect>
      )},
      {path:'/profile',element:(
        <AuthRedirect>
          <Profile key={'profile'} />
        </AuthRedirect>
      )},
      {path:'/setting',element:(
        <AuthRedirect>
          <Setting key={'setting'} />
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
