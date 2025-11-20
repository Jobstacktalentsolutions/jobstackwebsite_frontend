"use client";

import React from "react";
import { HomeIcon, Settings } from "lucide-react";
import { CreditCard, BarChart2 } from "lucide-react";
import { BriefcaseBusinessIcon } from "lucide-react"; // or your own

type EmployerTabsProps = {
    menuOpen: boolean;
};

const tabs = [
    { label: "Dashboard", icon: HomeIcon, href: "/pages/employer/dashboard" },
    {
        label: "Active Job Posts",
        icon: BriefcaseBusinessIcon,
        href: "/pages/employer/jobs",
    },
    {
        label: "Performance Analytics",
        icon: BarChart2,
        href: "/pages/employer/performance",
    },
    {
        label: "Billing & Payment",
        icon: CreditCard,
        href: "/pages/employer/billing",
    },
    { label: "Settings", icon: Settings, href: "/pages/employer/settings" },
];

const EmployerTabs: React.FC<EmployerTabsProps> = ({ menuOpen }) => {
    return (
        <>
            {/* Desktop / tablet */}
            <ul className="hidden md:flex list-none justify-between cursor-pointer my-4 max-w-4xl">
                {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = index === 0; // plug in route check later

                    return (
                        <li
                            key={tab.label}
                            className={`flex items-center text-sm lg:text-base font-light px-4 py-2 rounded-full transition-colors ${isActive ? "bg-white text-blue" : "hover:bg-white/10"
                                }`}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {tab.label}
                        </li>
                    );
                })}
            </ul>

            {/* Mobile dropdown */}
            {menuOpen && (
                <ul className="md:hidden mt-2 mb-4 list-none flex flex-col gap-1 rounded-2xl bg-white/10 p-3 text-sm">
                    {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        const isActive = index === 0;
                        return (
                            <li
                                key={tab.label}
                                className={`flex items-center rounded-xl px-3 py-2 transition-colors ${isActive ? "bg-white/35 text-blue" : "hover:bg-white/15"
                                    }`}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {tab.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
};

export default EmployerTabs;
