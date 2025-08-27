import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/user";

const Activate = () => {
  const authStore = useAuthStore();
  const [code, setCode] = useState("");

  const handleActivate = () => {
    if (!code.trim()) return;
    let activateToken = localStorage.getItem("activateToken") as string
    authStore.activateAccount({ activation_code:code,activation_token:activateToken }); // 👈 implement in your store
  };

  return (
    <div className="bg-[var(--primary-bg)] w-full h-[100vh] text-[var(--text)] flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-8 w-[400px] flex flex-col gap-6 bg-[var(--secondary-bg)] rounded-2xl shadow-lg mt-[140px]"
      >
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
        </div>

        {/* Submit */}
        <button
          onClick={handleActivate}
          className="w-full bg-[var(--text-highlight)] text-[var(--primary-bg)] 
                     font-semibold py-2 rounded-lg hover:opacity-90 
                     active:scale-[0.98] transition"
        >
          Activate
        </button>

        {/* Resend Option */}
        <p className="text-center text-sm text-gray-400 mt-2">
          Didn’t receive a code?{" "}
          <button
          
            className="text-[var(--text-highlight)] hover:underline"
          >
            Resend
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Activate;
