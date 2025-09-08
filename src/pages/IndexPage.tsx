import SideNav from "../components/SideNav";
import MobileSideNav from "../components/MobileSideNav";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuthStore } from "../store/user";
import { useEffect,  useState } from "react";

const Home = () => {
  const { user,premiumIn } = useAuthStore();
   const [open, setOpen] = useState<boolean>(false);
  const [premiumDay, setPremiumDay] = useState(10);

 

  useEffect(() => {
  
    if (premiumIn) {
      // let premiumExpire = new Date(user?.premiumExpire).getTime()
      let premiumDay = Math.ceil(premiumIn / (1000 * 60 * 60 * 24));
      // console.log(premiumIn)
      setPremiumDay(premiumDay);
    } else {
      setPremiumDay(0);
    }
  }, [premiumIn,user]);
  return (
    <div  className="w-full h-[100vh] bg-[var(--primary-bg)] text-[var(--text)] flex">
      {/* Desktop Sidebar */}
      <div className="w-[170px] hidden md:block ">
        <SideNav premiumDay={premiumDay} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSideNav premiumDay={premiumDay} open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 p-2 overflow-y-scroll ">
        <div className=" w-full bg-[var(--secondary-bg)] py-1 px-2 flex items-center justify-between md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="block md:hidden p-2  bg-[var(--primary-bg)] rounded-xl"
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
