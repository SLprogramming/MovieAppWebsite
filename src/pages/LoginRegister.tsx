import { Eye, EyeOff } from "lucide-react";
import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/user";

export type LoginFormInputType = {
  email: string;
  password: string;
};

export type RegisterFormInputType = LoginFormInputType & {
  name: string;
};

const initialLoginForm: LoginFormInputType = {
  email: "",
  password: "",
};

const initialRegisterForm: RegisterFormInputType = {
  name: "",
  email: "",
  password: "",
};



const Login = () => {
  const authStore = useAuthStore()
  const [loginFormInput, setLoginFormInput] = useState(initialLoginForm);
  const [registerFormInput, setRegisterFormInput] = useState(initialRegisterForm);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");

  const handleLogin = () => {
    if(!loginFormInput.email.trim() || !loginFormInput.password.trim()) return
    authStore.login(loginFormInput)
  }
  const handleRegister = () => {
    // console.log('hello')
    if(!registerFormInput.email.trim() || !registerFormInput.name.trim() || !registerFormInput.password.trim() ) return
    authStore.register(registerFormInput)
  }

  return (
    <div className="bg-[var(--primary-bg)] w-full h-[100vh] text-[var(--text)] flex justify-center items-start px-2">
      <div className="p-8 w-[400px] flex flex-col gap-6 bg-[var(--secondary-bg)] rounded-2xl shadow-lg mt-[140px] ">

        {/* Toggle Tabs */}
        <div className="flex justify-center gap-6 mb-4">
          <button
            onClick={() => setTab("login")}
            className={`pb-1 border-b-2 ${
              tab === "login"
                ? "border-[var(--text-highlight)] text-[var(--text-highlight)] font-semibold"
                : "border-transparent text-gray-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`pb-1 border-b-2 ${
              tab === "register"
                ? "border-[var(--text-highlight)] text-[var(--text-highlight)] font-semibold"
                : "border-transparent text-gray-400"
            }`}
          >
            Register
          </button>
        </div>

        {/* Animate Switching */}
        <AnimatePresence mode="wait">
          {tab === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
          

              {/* Email */}
              <div className="w-full">
                <label htmlFor="login_email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="login_email"
                  value={loginFormInput.email}
                  onChange={(e) => setLoginFormInput((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#2c2c2c] border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)] transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="w-full relative">
                <label htmlFor="login_password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login_password"
                  value={loginFormInput.password}
                  onChange={(e) => setLoginFormInput((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-[#2c2c2c] border border-transparent rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)] transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-[var(--text-highlight)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit */}
              <button onClick={handleLogin} className="w-full bg-[var(--text-highlight)] text-[var(--primary-bg)] font-semibold py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition">
                Login
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
          

              {/* Name */}
              <div className="w-full">
                <label htmlFor="name" className="block mb-1 text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={registerFormInput.name}
                  onChange={(e) => setRegisterFormInput((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#2c2c2c] border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)] transition"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label htmlFor="reg_email" className="block mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="reg_email"
                  value={registerFormInput.email}
                  onChange={(e) => setRegisterFormInput((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#2c2c2c] border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)] transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="w-full relative">
                <label htmlFor="reg_password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg_password"
                  value={registerFormInput.password}
                  onChange={(e) => setRegisterFormInput((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-[#2c2c2c] border border-transparent rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)] transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-[var(--text-highlight)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit */}
              <button onClick={handleRegister} className="w-full bg-[var(--text-highlight)] text-[var(--primary-bg)] font-semibold py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition">
                Register
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
