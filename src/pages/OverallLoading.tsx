import React from "react";

const OverallLoading = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[var(--primary-bg)] text-[var(--text-highlight)]">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-[var(--secondary-bg)] border-t-[var(--text-highlight)] rounded-full animate-spin mb-4"></div>
      
     

   
    </div>
  );
};

export default OverallLoading;
