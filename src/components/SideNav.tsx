import { BookHeart, Bookmark, CircleDollarSign, Clapperboard, ClockFading, Film, Hash, House, Search, Settings, Shapes, SquareUser } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = [
    {
        title:"Search",
        icon:<Search />,
        url:"#"
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
        url:"#"
    },
    {
        title:"Bookmark",
        icon:<Bookmark />,
        url:"#"
    },
    {
        title:"Favorite",
        icon:<BookHeart />,
        url:"#"
    },
    {
        title:"Buy VIP",
        icon:<CircleDollarSign />,
        url:"#"
    },
    {
        title:"Profile",
        icon:<SquareUser />,
        url:"#"
    },
    {
        title:"Genre",
        icon:<Shapes />,
        url:"#"
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

const SideNav = () => {
   const navigate = useNavigate()
   
  return (
    <>
    <div className='h-full w-full p-2 flex flex-col gap-2 justify-start items-start'>
        {navItems.map(e => (<div key={e.title} onClick={() => navigate(e.url)} className='flex justify-start gap-4 w-full select-none cursor-pointer hover:bg-[var(--secondary-bg)] px-3 py-2 rounded-2xl font-bold'>{e.icon}{e.title} </div>))}
    </div>
    </>
  )
}

export default SideNav