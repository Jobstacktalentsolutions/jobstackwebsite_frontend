"use client";

import React from "react";

export type LoadingProps = {
  text?: string;
};

const Loading: React.FC<LoadingProps> = ({ text = "Jobstack..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#2572A7]">
      <div className="text-3xl md:text-5xl font-semibold">
        <span
          className="
            inline-block 
            overflow-hidden 
            border-r-2 
            border-[#2572A7] 
            animate-typing-bounce
            
          "
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default Loading;
