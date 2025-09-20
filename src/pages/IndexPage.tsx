import SideNav from "../components/SideNav";
import MobileSideNav from "../components/MobileSideNav";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuthStore } from "../store/user";
import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";

const Home = () => {
  const { user, premiumIn } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const {resetSearchKeyword} = useContentStore()
  const [premiumDay, setPremiumDay] = useState(0);
  const location = useLocation()

  useEffect(() => {
    if (premiumIn) {
      // let premiumExpire = new Date(user?.premiumExpire).getTime()
      let premiumDay = Math.max(0,Math.ceil(premiumIn / (1000 * 60 * 60 * 24)));
      // console.log(premiumIn)
      setPremiumDay(premiumDay);
    } else {
      setPremiumDay(0);
    }
  }, [premiumIn, user]);
  useEffect(() => {
   
    if(location.pathname != '/search'){
resetSearchKeyword()
    }
  },[location.pathname])
  return (
    <div className="w-full h-[100vh] bg-[var(--primary-bg)] text-[var(--text)] flex">
      {/* Desktop Sidebar */}
      <div className="w-[170px] hidden md:block ">
        <SideNav premiumDay={premiumDay} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSideNav premiumDay={premiumDay} open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1  pb-2 overflow-y-scroll relative">
        <div className="w-full bg-[var(--secondary-bg)] py-1 px-2 flex items-center justify-between md:hidden sticky top-0 z-10">
          <button
            onClick={() => setOpen(true)}
            className="block md:hidden p-2 bg-[var(--primary-bg)] rounded-xl"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2
              className={`ps-2 ${
                premiumDay > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              Premium - {premiumDay} day{premiumDay > 1 ? "s" : ""}
            </h2>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
