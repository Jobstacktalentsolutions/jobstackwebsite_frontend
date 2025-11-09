"use client";

import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#2572A7]">
      <div className="text-3xl md:text-5xl font-semibold">
        <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-[#2572A7] animate-typing-bounce">
          Jobstack.
        </span>
      </div>
    </div>
  );
};

export default Loading;
