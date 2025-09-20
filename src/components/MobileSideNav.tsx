// MobileSideNav.tsx
import { X, Search, House, Clapperboard, Film, ClockFading, Bookmark, BookHeart, CircleDollarSign, SquareUser, Shapes,  Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/user";
// import type { SideNavProp } from "../types/sidebar";

const navItems = [
  { title:"Search", icon:<Search />, url:"/search" },
  { title:"Home", icon:<House />, url:"/" },
  { title:"Movies", icon:<Clapperboard />, url:"/movie" },
  { title:"Series", icon:<Film />, url:"/serie" },
  { title:"Recent", icon:<ClockFading />, url:"/recent" },
  { title:"Bookmark", icon:<Bookmark />, url:"/bookmark" },
  { title:"Favorite", icon:<BookHeart />, url:"/favorite"},
  { title:"Buy VIP", icon:<CircleDollarSign />, url:"/purchase"},
  { title:"Profile", icon:<SquareUser />, url:"/profile"},
  { title:"Genre", icon:<Shapes />, url:"/genre"},
  // { title:"Tags", icon:<Hash />, url:"#"},
  { title:"Setting", icon:<Settings />, url:"#"},
];

const MobileSideNav = ({ premiumDay, open, setOpen }: {
    premiumDay:number,
    open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleNavigate = (url: string) => {
    navigate(url);
    setOpen(false); // close nav after click
  };
  const {logout} = useAuthStore()
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-[var(--primary-bg)] text-[var(--text)] z-50 p-4 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`ps-2 ${
              premiumDay > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            Premium - {premiumDay} day{premiumDay > 1 ? "s" : ""}
          </h2>
          <button onClick={() => setOpen(false)} className="p-2">
            <X />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-2">
          {navItems.map((e) => (
            <div
              key={e.title}
              onClick={() => handleNavigate(e.url)}
              className={`flex items-center gap-4 w-full select-none cursor-pointer hover:text-[var(--text-highlight)] hover:scale-105 hover:translate-x-1 transition-all duration-200 px-3 py-2 rounded-2xl font-bold ${
                e.url === activeTab
                  ? "bg-[var(--secondary-bg)] scale-105 translate-x-1"
                  : ""
              }`}
            >
              {e.icon}
              {e.title}
            </div>
          ))}
              <button className='flex justify-start gap-4 w-full select-none cursor-pointer px-3 py-2 rounded-2xl font-bold' onClick={logout}><LogOut />logout</button>

        </div>
      </div>
    </>
  );
};

export default MobileSideNav;
