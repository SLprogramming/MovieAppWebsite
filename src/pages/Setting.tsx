import { Calendar, ChevronLeft, LogOut, Monitor, MonitorSmartphone, Power, RectangleEllipsis, Smartphone } from 'lucide-react'
import React, { useState } from 'react'
import { useAuthStore, type User } from '../store/user'

type LoginDeviceProp = {
    setShowLoginDevice:React.Dispatch<React.SetStateAction<boolean>>,
    user:User | null,
    removeSession: ({ sessionId }: {
    sessionId: string;
}) => Promise<any>,
fetchMe: ({ checking }: {
    checking: boolean;
}) => Promise<void>,
logout: () => Promise<void>
}

const loginDevices = ({setShowLoginDevice,user,removeSession,fetchMe,logout} : LoginDeviceProp) => {
   
function getShortDevice(ua:string) {
  const match = ua.match(/\(([^)]+)\)/); // take inside parentheses
  if (!match) return ua;

  const parts = match[1].split(";");
  const os = parts[1]?.trim(); // Android 6.0
  const model = parts[2]?.trim(); // Nexus 5 Build/MRA58N

  return `${os} – ${model.split(" Build")[0]}`;
}
console.log(user?.sessions.filter(e => e.device == navigator.userAgent))
const handleTerminate = async ({device,id}:{device:string,id:string}) => {
    try {
        
        if(device == navigator.userAgent){
            logout()
        }else{
           let res = await removeSession({sessionId:id})
           if(res.data.success){
            fetchMe({checking:false})
           }
        }
    } catch (error) {
        
    }
}
    return (
    <div className="w-full h-full p-3 relative text-[var(--text)]">
  {/* Back button */}
  <div className="flex scale-90 sm:scale-100 absolute left-4 sm:left-5 top-4 sm:top-6">
    <div
      className="p-3 bg-[var(--secondary-bg)] rounded-full hover:opacity-85 cursor-pointer"
      onClick={() => setShowLoginDevice(false)}
    >
      <ChevronLeft className="text-[var(--text-highlight)]" />
    </div>
  </div>

  <div className="max-w-4xl mx-auto p-4 sm:p-6">
    <h2 className="text-center text-lg sm:text-xl font-bold mb-6 text-[var(--text-highlight)]">
      Login Devices
    </h2>

    <div className="space-y-4 sm:space-y-6">
      {user?.sessions.map((device, index) => (
        <div
          key={index}
          className="bg-[var(--secondary-bg)] rounded-xl shadow p-4 sm:p-5 border border-[var(--primary-bg)]"
        >
          {/* Device header */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-highlight)]" />
            <h3 className="font-semibold text-[var(--text-highlight)] text-sm sm:text-base">
              {getShortDevice(device.device)}
            </h3>
          </div>

          <p className="text-[var(--text)] text-xs sm:text-sm break-all">{device._id}</p>

          <p className="mt-2 text-[var(--text)] text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--text-highlight)]" />
            Last login: {device.createdAt}
          </p>

          <hr className="my-2 sm:my-3 border-[var(--primary-bg)]" />

          <button onClick={() => handleTerminate({device:device.device,id:device._id})} className="flex items-center gap-1 sm:gap-2 text-[var(--favorite)] font-medium hover:opacity-80 text-xs sm:text-sm">
            <Power className="w-3 h-3 sm:w-4 sm:h-4" />
            Logout this device
          </button>
        </div>
      ))}
    </div>
  </div>
</div>


    )
}

const Setting = () => {
 const {user,removeSession,fetchMe,logout} = useAuthStore()
    const [showLoginDevice,setShowLoginDevice] = useState(false)
    

if(showLoginDevice){
    return loginDevices({setShowLoginDevice,user,removeSession,fetchMe,logout})
}

  return (
    <div className='flex p-3 flex-col justify-start items-center h-full gap-5 w-full md:w-4/5 mx-auto'>
        <h1 className='text-center text-[var(--text-highlight)] w-full my-2'>Setting</h1>
        <div className='bg-[var(--secondary-bg)] px-3 py-2 w-full flex gap-2 rounded-sm' onClick={() => setShowLoginDevice(true)}> <MonitorSmartphone /> <div>Login Devices</div></div>
        <div className='bg-[var(--secondary-bg)] px-3 py-2 w-full flex gap-2 rounded-sm'> <RectangleEllipsis /> <div>Change Password</div></div>
        <div className='bg-[var(--secondary-bg)] px-3 py-2 w-full flex gap-2 rounded-sm'><LogOut /> <div>Logout</div></div>
    </div>
  )
}

export default Setting