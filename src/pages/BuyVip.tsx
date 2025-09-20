import React, { useEffect, useState } from "react";
import api from "../axios";
import { usePurchaseStore, type PaymentAccount } from "../store/purchase";
import SelectInput from "../components/customSelect";

import { Copy } from "lucide-react";
import { useAuthStore } from "../store/user";

interface Option {
  value: string;
  label: string;
}

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: any) => {
    e.preventDefault();
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    } else {
      // fallback for unsupported browsers
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 flex items-center text-gray-300 hover:text-white"
      title="Copy"
    >
      <Copy size={16} />
      <span className="ml-1 text-xs">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
};

const BuyVip = () => {
  const {

    fetchAccounts,
    plans,
    paymentPlatforms,
    paymentAccounts,
  } = usePurchaseStore();
  const { user } = useAuthStore();
  const [submiting, setSubmiting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedAccount, setSelectedAccount] =
    useState<PaymentAccount | null>();
  const [packageOptions, setPackageOptions] = useState<Option[]>([]);
  const [platformOptions, setPlatformOptions] = useState<Option[]>([]);
  const [transactionId, setTransactionId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

 

  useEffect(() => {
    setSelectedPlatform(paymentPlatforms[0]?._id || "");
    setPlatformOptions(
      paymentPlatforms.map((e) => ({ value: e._id, label: e.name }))
    );
    setSelectedPackage(plans[0]?._id || "");
    setPackageOptions(plans.map((e) => ({ value: e._id, label: e.name })));
  }, [plans, paymentPlatforms]);

  useEffect(() => {
    if (selectedPlatform) {
      console.log("fetch");
      fetchAccounts(selectedPlatform);
    }
  }, [selectedPlatform]);

  useEffect(() => {
    setSelectedAccount(paymentAccounts[0]);
  }, [paymentAccounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setSubmiting(true);
      e.preventDefault();
      if (!image) {
        alert("Please select a file first");
        return;
      }
      const formData = new FormData();
      formData.append("user_id", user?._id || "");
      formData.append("plan_id", selectedPackage);
      formData.append("transitionNumber", transactionId);
      formData.append("bankAccount_id", selectedAccount?._id || "");
      formData.append("img", image);
      let response = await api.post("purchase/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
    } catch (error) {
      setSubmiting(false);
    } finally {
      setSubmiting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 p-6 rounded-lg bg-gray-800 shadow-lg"
      >
        {/* Package */}

        <div>
          <label className="block text-sm font-semibold mb-1">
            Select Premium Package
          </label>
          {/* <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className={`w-full px-4 py-3 rounded bg-gray-700 text-white border ${
              !selectedPackage ? "border-red-500" : "border-gray-600"
            }`}
          >
            <option value="">Select Package</option>
            {plans.map((e) => {
              return (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              );
            })}
          </select> */}
          <SelectInput
            onChange={setSelectedPackage}
            options={packageOptions}
            value={selectedPackage}
            placeholder="choose a package"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Select Platform
          </label>
          <SelectInput
            onChange={setSelectedPlatform}
            options={platformOptions}
            value={selectedPlatform}
            placeholder="choose a platform"
          />
        </div>

        {/* Payment Info */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Payment Info
          </label>
          <div className="flex items-center justify-between w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600">
            <span>
              Name: {paymentAccounts[0]?.name}, Pay No:{" "}
              {paymentAccounts[0]?.accNumber}
            </span>
            {paymentAccounts[0]?.accNumber && (
              <CopyButton text={paymentAccounts[0].accNumber} />
            )}
          </div>
        </div>

        {/* Transaction ID */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Transaction No/ID
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter your transaction ID"
            className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-green-400 text-sm mt-1">
            သင်ပေးငွေပြေစာရှိနံပါတ်(၆)လုံးကို ထည့်သွင်းပေးပါ။
          </p>
        </div>

        {/* Upload Screenshot */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Upload Screenshot
          </label>
          <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded bg-gray-700 text-gray-400 overflow-hidden">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="object-contain w-full h-full"
              />
            ) : (
              <p>Choose Image ကိုနှိပ်ပြီး screenshot ကို upload ပြုလုပ်ပါ။</p>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="mt-2 block w-full text-center px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 cursor-pointer"
          >
            Choose Image
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
        <button
        type="submit"
        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 font-semibold flex items-center justify-center gap-2"
        disabled={submiting} // disable button while loading
      >
         {submiting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {submiting ? "Submitting..." : "Submit"}
      </button>
        </div>
      </form>
    </div>
  );
};

export default BuyVip;
