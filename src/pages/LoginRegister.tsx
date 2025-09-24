import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/user";
import { toast } from "react-toastify";
import api from "../axios";

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
  let initialStateError = {
    name: "",
    email: "",
    password: "",
  };

  const authStore = useAuthStore();
  const [loginFormInput, setLoginFormInput] = useState(initialLoginForm);
  const [registerFormInput, setRegisterFormInput] =
    useState(initialRegisterForm);
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState(initialStateError);
  const [regErrors, setRegErrors] = useState(initialStateError);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/auth/forgot-password", {
        email: forgotEmail,
      });
      if (res.data.success) {
        toast.success("Reset link sent to your email!");
        setForgotEmail("");
      } else if (res.data.error?.email) {
        setForgotError(res.data.error.email);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (!loginFormInput.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is Required" }));
      return;
    } else if (!loginFormInput.password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is Required" }));
      return;
    }
    if (submitting) return; // prevent double click

    setSubmitting(true);
    try {
      let data = await authStore.login(loginFormInput);
      console.log(data);
    } catch (err: any) {
      console.log(err?.response?.data);
      let data = err?.response?.data;
      if (data?.error) {
        setErrors(data?.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!registerFormInput.name.trim()) {
      setRegErrors((prev) => ({ ...prev, name: "Name is Required" }));
      console.log("name");
      return;
    } else if (!registerFormInput.email.trim()) {
      setRegErrors((prev) => ({ ...prev, email: "Email is Required" }));
      return;
    } else if (!registerFormInput.password.trim()) {
      setRegErrors((prev) => ({ ...prev, password: "Password is Required" }));
      return;
    }
    if (submitting) return; // prevent double click

    setSubmitting(true);
    try {
      let data = await authStore.register(registerFormInput);
      console.log(data);
    } catch (err: any) {
      console.log(err?.response?.data);
      let data = err?.response?.data;
      if (data?.error) {
        setRegErrors(data?.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
                <label
                  htmlFor="login_email"
                  className="block mb-1 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="login_email"
                  value={loginFormInput.email}
                  onChange={(e) => {
                    setLoginFormInput((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, email: "" })); // clear error on change
                  }}
                  className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition 
      ${
        errors.email
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
      }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="w-full relative">
                <label
                  htmlFor="login_password"
                  className="block mb-1 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login_password"
                  value={loginFormInput.password}
                  onChange={(e) => {
                    setLoginFormInput((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, password: "" })); // clear error on change
                  }}
                  className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 pr-10 focus:outline-none transition 
      ${
        errors.password
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
      }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-[var(--text-highlight)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <span className="text-blue-500 cursor-pointer select-none hover:opacity-85 inline w-[170px]"   onClick={() => setTab("forgot")}>Forget Password?</span>

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-2 rounded-lg transition
    ${
      submitting
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-[var(--text-highlight)] text-[var(--primary-bg)] hover:opacity-90 active:scale-[0.98]"
    }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-[var(--primary-bg)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </motion.div>
          ) : tab === "register" ? (
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
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={registerFormInput.name}
                  onChange={(e) => {
                    setRegisterFormInput((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                    setRegErrors((prev) => ({ ...prev, name: "" })); // clear error on typing
                  }}
                  className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition
      ${
        regErrors.name
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
      }`}
                  placeholder="Enter your name"
                />
                {regErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{regErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="w-full">
                <label
                  htmlFor="reg_email"
                  className="block mb-1 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="reg_email"
                  value={registerFormInput.email}
                  onChange={(e) => {
                    setRegisterFormInput((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    setRegErrors((prev) => ({ ...prev, email: "" })); // clear error when typing
                  }}
                  className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition
      ${
        regErrors.email
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
      }`}
                  placeholder="Enter your email"
                />
                {regErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{regErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="w-full relative">
                <label
                  htmlFor="reg_password"
                  className="block mb-1 text-sm font-medium"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg_password"
                  value={registerFormInput.password}
                  onChange={(e) => {
                    setRegisterFormInput((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                    setRegErrors((prev) => ({ ...prev, password: "" })); // clear error when typing
                  }}
                  className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 pr-10 focus:outline-none transition
      ${
        regErrors.password
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
      }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-[var(--text-highlight)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {regErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {regErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleRegister}
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-2 rounded-lg transition
    ${
      submitting
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-[var(--text-highlight)] text-[var(--primary-bg)] hover:opacity-90 active:scale-[0.98]"
    }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-[var(--primary-bg)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Email */}
              <div className="w-full">
                <label
                  htmlFor="forgot_email"
                  className="block mb-1 text-sm font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="forgot_email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError("");
                  }}
                  className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition 
            ${
              forgotError
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
            }`}
                  placeholder="Enter your email"
                />
                {forgotError && (
                  <p className="mt-1 text-sm text-red-500">{forgotError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleForgotPassword}
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-2 rounded-lg transition
          ${
            submitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--text-highlight)] text-[var(--primary-bg)] hover:opacity-90 active:scale-[0.98]"
          }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-[var(--primary-bg)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
