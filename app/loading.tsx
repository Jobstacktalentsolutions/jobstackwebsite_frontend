"use client";

import React from "react";

export type LoadingProps = {
  text?: string;
};

const Loading: React.FC<LoadingProps> = ({ text = "Jobstack..." }) => {
  return (
    <div className="min-h-screen relative overflow-hidden min-w-screen flex items-center justify-center bg-white text-[#2572A7]">
      <div className="text-3xl md:text-5xl font-semibold">
        <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-[#2572A7] animate-typing-bounce">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Loading;
