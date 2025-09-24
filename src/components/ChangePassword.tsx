import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import api from "../axios";
import { toast } from "react-toastify";


type ChangePasswordProps = {
  setSelectedTab: React.Dispatch<
    React.SetStateAction<"setting" | "changePassword" | "loginDevice">
  >;
};

type initialFormInputType = {
  oldPassword: string;
  newPassword: string;
};

const initialFormInput = {
  oldPassword: "",
  newPassword: "",
};

const ChangePassword = ({ setSelectedTab }: ChangePasswordProps) => {
  
  const [formInput, setFormInput] =
    useState<initialFormInputType>(initialFormInput);

  const [inlineErrors, setInlineErrors] =
    useState<initialFormInputType>(initialFormInput);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting,setSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      let isValid =checkInputError()
      if(!isValid){
        return
      }
      setSubmitting(true)
      let res = await api.put('/auth/update-password',formInput)
      console.log(res)
      if(res.data.success){
        toast.success('Password Change Successfully')
        setFormInput(initialFormInput)
      }else{
        if(res.data.data){
          setInlineErrors(res.data.data)
        }
      }
    } catch (error) {
            setSubmitting(false)

    }finally{
            setSubmitting(false)

    }
  }

  const checkInputError = () => {
    if(formInput.oldPassword.trim() == ""){
      setInlineErrors(prev => ({...prev,oldPassword:`please fill the old password`}))
      return null
    }else if(formInput.newPassword.trim() == ""){
      setInlineErrors(prev => ({...prev,newPassword:`please fill the new password`}))
            return null

    }else if(formInput.oldPassword.trim() == formInput.newPassword.trim()){
      setInlineErrors(prev => ({...prev,newPassword:`new password shouldn't same with old one`}))
            return null

    }else if(formInput.newPassword.trim().length < 6){
     setInlineErrors(prev => ({...prev,newPassword:`please fill at least 6 character`}))
           return null

    }

    return true
  }

  return (
    <div className="w-full h-full p-3 relative text-[var(--text)]">
      {/* Back button */}
      <div className="flex scale-90 sm:scale-100 absolute left-4 sm:left-5 top-4 sm:top-6">
        <div
          className="p-3 bg-[var(--secondary-bg)] rounded-full hover:opacity-85 cursor-pointer"
          onClick={() => setSelectedTab("setting")}
        >
          <ChevronLeft className="text-[var(--text-highlight)]" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h2 className="text-center text-lg sm:text-xl font-bold mb-6 text-[var(--text-highlight)]">
          Change Password
        </h2>
        <div className="flex flex-col gap-6 w-full md:w-3/5 mx-auto">
          {/* Email */}
          <div className="w-full">
            <label
              htmlFor="old_password"
              className="block mb-1 text-sm font-medium"
            >
              Old Password
            </label>
            <input
              type="email"
              id="old_password"
              value={formInput.oldPassword}
              onChange={(e) => {
                setFormInput((prev) => ({
                  ...prev,
                  oldPassword: e.target.value,
                }));
                setInlineErrors((prev) => ({ ...prev, oldPassword: "" })); // clear error on change
              }}
              className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 focus:outline-none transition 
      ${
        inlineErrors.oldPassword
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-transparent focus:border-[var(--text-highlight)] focus:ring-1 focus:ring-[var(--text-highlight)]"
      }`}
              placeholder="Enter your email"
            />
            {inlineErrors.oldPassword && (
              <p className="mt-1 text-sm text-red-500">
                {inlineErrors.oldPassword}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="w-full relative">
            <label
              htmlFor="new_password"
              className="block mb-1 text-sm font-medium"
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="new_password"
              value={formInput.newPassword}
              onChange={(e) => {
                setFormInput((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }));
                setInlineErrors((prev) => ({ ...prev, newPassword: "" })); // clear error on change
              }}
              className={`w-full bg-[#2c2c2c] border rounded-lg px-4 py-2 pr-10 focus:outline-none transition 
      ${
        inlineErrors.newPassword
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
            {inlineErrors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {inlineErrors.newPassword}
              </p>
            )}
          </div>
           <button
                onClick={handleSubmit}
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
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
