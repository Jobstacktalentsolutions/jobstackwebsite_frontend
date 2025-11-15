"use client";

import React, { useState } from "react";
import Dashboardnav from "@/app/pages/components/dashboardnav";
import EmployerTabs from "@/app/pages/components/employerTabs";
// import SearchBar from "./SearchBar";
import { useAuth } from "@/app/lib/auth-context";

const EmployerHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth();

    return (
        <header className="bg-blue text-white w-full px-4 md:px-10 lg:px-24 py-6 md:py-10 rounded-br-[40px] md:rounded-br-[80px]">
            <Dashboardnav onToggleMenu={() => setMenuOpen((prev) => !prev)} />

            <EmployerTabs menuOpen={menuOpen} />

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                    Welcome, {user?.firstName || "Employer"}!
                </h1>
                {/* <SearchBar /> */}
            </div>
        </header>
    );
};

export default EmployerHeader;
