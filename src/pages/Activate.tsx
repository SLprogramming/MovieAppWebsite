import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const Activate = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);

  // ⏳ Timer State
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    let expireIn = localStorage.getItem('activateExpireIn') as string
    if(expireIn) {
      // console.log( parseInt(expireIn) -Date.now()  )
      let data = Math.round((parseInt(expireIn) - Date.now())/1000)
      setTimeLeft(data)
    }
  },[])

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleActivate = async () => {
    if (!code.trim()) return;
    let activateToken = localStorage.getItem("activateToken") as string;

    authStore.activateAccount(
      {
        activation_code: code,
        activation_token: activateToken,
      },
      setSuccess
    );
  };

  return (
    <div className="bg-[var(--primary-bg)] w-full h-[100vh] text-[var(--text)] flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8 w-[400px] flex flex-col gap-6 bg-[var(--secondary-bg)] rounded-2xl shadow-lg mt-[140px] min-h-[320px] items-center justify-center"
      >
        {!success ? (
          <>
            <h2 className="text-center text-xl font-semibold mb-2">
              Activate Your Account
            </h2>
            <p className="text-center text-sm text-gray-400">
              Enter the 6-digit code sent to your email
            </p>

            {/* Activation Code */}
            <div className="w-full">
              <label
                htmlFor="activation_code"
                className="block mb-1 text-sm font-medium"
              >
                Activation Code
              </label>
              <input
                type="text"
                id="activation_code"
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#2c2c2c] border border-transparent rounded-lg 
                       px-4 py-2 text-center tracking-[0.5em] font-semibold text-lg 
                       focus:outline-none focus:border-[var(--text-highlight)] 
                       focus:ring-1 focus:ring-[var(--text-highlight)] transition"
                placeholder="123456"
              />

              {/* Timer */}
              <p className="text-center text-sm mt-2 text-gray-400">
                {timeLeft > 0 ? (
                  <>Code expires in <span className="text-[var(--text-highlight)]">{formatTime(timeLeft)}</span></>
                ) : (
                  <span className="text-red-500">Code expired <span onClick={() => navigate('/login')} className="text-[var(--text-highlight)] hover:underline cursor-pointer select-none">go to login</span></span>
                )}
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleActivate}
              disabled={timeLeft <= 0}
              className={`w-full font-semibold py-2 rounded-lg transition ${
                timeLeft > 0
                  ? "bg-[var(--text-highlight)] text-[var(--primary-bg)] hover:opacity-90 active:scale-[0.98]"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              Activate
            </button>
          </>
        ) : (
          // ✅ Success Animation
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 52 52"
              className="text-green-500"
            >
              <motion.circle
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                d="M14 27l7 7 16-16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </motion.svg>
            <p className="text-lg font-semibold text-green-500">
              Account Activated!
            </p>
            {/* Go to Login */}
            <button
              onClick={() => navigate("/login")}
              className="mt-2 w-full bg-[var(--text-highlight)] transition-all duration-150 text-[var(--primary-bg)] 
                         font-semibold py-2 rounded-lg hover:opacity-90 
                         active:scale-[0.93]"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Activate;
