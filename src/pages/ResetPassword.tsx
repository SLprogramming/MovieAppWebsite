import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErr,setPasswordErr] = useState("")
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState<boolean[]>([true,true])
  const { token } = useParams<{ token: string }>(); // reset token from URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(password.trim() == ""){
      setPasswordErr('please fill the password')
      console.log('blank')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if(password.trim().length < 6){
      setPasswordErr('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

    const res = await api.post(`/auth/reset-password/${token}`, {
  password,
});


      if(res.data.success){
      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
      }
     
    } catch (err: any) {
      // setError(err.message);
      toast.error(err?.response?.data?.message)
      setConfirmPassword('')
      setPassword('')
      // console.log(err)
    } finally {
      setLoading(false);
       setConfirmPassword('')
      setPassword('')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c29]">
      <div className="bg-[#0f1116] p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-[var(--text-highlight)]">
          <div className="w-full relative">
            <label className="block text-sm text-gray-300">New Password</label>
            <input
              type={showPassword[0] ? "text" : "password"}
                 className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition 
            ${
              passwordErr
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
            }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordErr('')
              }}
              
            />
             <button
                  type="button"
                  onClick={() => setShowPassword((prev) => [!prev[0],prev[1]])}
                  className="absolute right-3 top-[30px] text-gray-400 hover:text-[var(--text-highlight)]"
                >
                  {showPassword[0] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             {passwordErr && <p className="text-red-400 text-sm">{passwordErr}</p>}
          </div>
          <div className="w-full relative">
            <label className="block text-sm text-gray-300">
              Confirm Password
            </label>
            <input
              type={showPassword[1] ? "text" : "password"}
                className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition 
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
            }`}
              value={confirmPassword}
              onChange={(e) => {
                 setConfirmPassword(e.target.value)
                 setError('')
              }}
              required
            />
               <button
                  type="button"
                  onClick={() => setShowPassword((prev) => [prev[0],!prev[1]])}
                  className="absolute right-3 top-[30px] text-gray-400 hover:text-[var(--text-highlight)]"
                >
                  {showPassword[1] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default ResetPassword;
