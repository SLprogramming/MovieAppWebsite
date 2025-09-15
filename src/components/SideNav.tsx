import { BookHeart, Bookmark, CircleDollarSign, Clapperboard, ClockFading, Film, Hash, House, Search, Settings, Shapes, SquareUser } from 'lucide-react'
import  { useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/user'
import type { SideNavProp } from '../types/sidebar'

const navItems = [
    {
        title:"Search",
        icon:<Search />,
        url:"/search"
    },
    {
        title:"Home",
        icon:<House />,
        url:"/"
    },
    {
        title:"Movies",
        icon:<Clapperboard />,
        url:"/movie"
    },
    {
        title:"Series",
        icon:<Film />,
        url:"/serie"
    },
    {
        title:"Recent",
        icon:<ClockFading />,
        url:"/recent"
    },
    {
        title:"Bookmark",
        icon:<Bookmark />,
        url:"/bookmark"
    },
    {
        title:"Favorite",
        icon:<BookHeart />,
        url:"#"
    },
    {
        title:"Buy VIP",
        icon:<CircleDollarSign />,
        url:"/purchase"
    },
    {
        title:"Profile",
        icon:<SquareUser />,
        url:"/profile"
    },
    {
        title:"Genre",
        icon:<Shapes />,
        url:"/genre"
    },
    {
        title:"Tags",
        icon:<Hash />,
        url:"#"
    },
    {
        title:"Setting",
        icon:<Settings />,
        url:"#"
    },
]

const SideNav = ({premiumDay}:SideNavProp) => {
    const {logout} = useAuthStore()
   const navigate = useNavigate()
   const location = useLocation()
   
   const [activeTab,setActiveTab] = useState(location.pathname)
 
   useEffect(() => {
     setActiveTab(location.pathname)
   },[location.pathname])
   
  return (
    <>
    <h2 className={`ps-5 py-2 ${premiumDay > 0 ? 'text-green-600' :'text-red-500'}`}>Premium - {premiumDay} day{premiumDay > 1 ? 's' :''}</h2>
    <div className=' w-full p-2 flex flex-col gap-2 justify-start items-start'>
        {navItems.map(e => (<div key={e.title} onClick={() => navigate(e.url)} className={`flex justify-start gap-4 w-full select-none cursor-pointer hover:text-[var(--text-highlight)] hover:scale-105 hover:translate-x-1 transition-all duration-200 px-3 py-2 rounded-2xl font-bold ${e.url == activeTab ? 'bg-[var(--secondary-bg)] scale-105 translate-x-1' : '' }`}>{e.icon}{e.title} </div>))}
    <button className='flex justify-start gap-4 w-full select-none cursor-pointer px-3 py-2 rounded-2xl font-bold' onClick={logout}>logout</button>
    </div>
    </>
  )
}

export default SideNav