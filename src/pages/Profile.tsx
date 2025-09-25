import { User, Smile, Calendar, CreditCard, Repeat,  ChevronLeft } from "lucide-react";
import { useAuthStore } from "../store/user";
import { useEffect, useMemo, useState } from "react";
;
import { usePurchaseStore } from "../store/purchase";



const Profile = () => {
  
const [selectedTab,setSelectedTab] =useState<'profile' | 'history'>('profile')
const {user,premiumIn} = useAuthStore()
const {purchaseHistory,fetchPurchaseRequest,paymentPlatforms} = usePurchaseStore()

useEffect(() => {
    if(user?._id){

        fetchPurchaseRequest(user?._id)
    }
},[])

const platformMap = useMemo(() => {
  // convert array into lookup map
  return paymentPlatforms.reduce((acc, platform) => {
    acc[platform._id] = platform;
    return acc;
  }, {} as Record<string, any>);
}, [paymentPlatforms]);

const getPaymentPlatform = (id: string) => {
  return (platformMap[id] || {name:'default'});
};
useEffect(() => {
    if(paymentPlatforms){

        console.log(getPaymentPlatform(paymentPlatforms[0]?._id).name ,paymentPlatforms)
    }
},[paymentPlatforms])
 return (
    < >
        {selectedTab == 'profile' &&(<div className="h-[95vh] flex flex-col items-center justify-start py-[100px] px-[30px]">

      <div className="w-full  md:w-md space-y-2">
        {/* Email */}
        <div className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-3 rounded border border-gray-600">
          <User size={18} />
          <span>{user?.email}</span>
        </div>

        {/* Username */}
        <div className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-3 rounded border border-gray-600">
          <Smile size={18} />
          <span>{user?.name}</span>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center gap-2 bg-gray-700 text-gray-200 px-4 py-3 rounded border border-gray-600">
          <Calendar size={18} />
          <span>{user?.premiumExpire ?? '-'}</span>
        </div>

        {/* Plan */}
        <div className="flex items-center gap-2 bg-gray-700 text-green-400 px-4 py-3 rounded border border-gray-600">
          <CreditCard size={18} />
          <span> { Math.max(0,Math.ceil(premiumIn / (1000 * 60 * 60 * 24)))} Days</span>
        </div>

        {/* Payment History */}
        <div className="flex items-center gap-2 bg-gray-700 text-[var(--primary)] px-4 py-3 rounded border border-[var(--primary)]" onClick={() => setSelectedTab('history')}>
          <Repeat size={18} />
          <span className="underline cursor-pointer">Payment history</span>
        </div>
      </div>

 
        </div>)}
        {selectedTab == "history" && ( <div className="min-h-screen bg-[#1c1d24] text-white p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button className="p-2 rounded-full hover:bg-gray-700">
          <ChevronLeft size={22} onClick={() => setSelectedTab('profile')} />
        </button>
        <h1 className="text-xl font-semibold">Payment History</h1>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 ">
        {purchaseHistory.map((p) => (
          <div
            key={p._id}
            className="flex items-center justify-between bg-[#2a2b31] rounded-lg p-3 hover:bg-[#33343b]"
          >
            <div className="flex items-center gap-3">
              {/* Slip Image */}
              <img
                src={p?.img?.url}
                alt="Slip"
                className="w-16 h-20 object-cover rounded-md border border-gray-600"
              />

              {/* Payment Details */}
              <div className="text-sm">
                <p className="text-sm text-gray-400">
                  Transaction No: <span className="text-white">{p.transitionNumber}</span>
                </p>
                <p className="text-green-500 font-semibold">{p?.plan_id?.name}</p>
                <p className="text-white">{p?.plan_id?.price}</p>
                <p className="text-gray-300">{p?.bankAccount_id?._id ? getPaymentPlatform(p?.bankAccount_id?.paymentType_id).name : ''}</p>
              </div>
            </div>

            {/* Status */}
            <span
              className={`font-sm text-sm ${
                p?.status === "approved"
                  ? "text-green-500"
                  : p.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>)}
    </>
  );
}

export default Profile