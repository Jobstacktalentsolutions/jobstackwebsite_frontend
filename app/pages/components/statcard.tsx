// components/StatCard.tsx
import React from "react";

type StatCardProps = {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    iconBgClassName?: string;
};

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    subtitle,
    iconBgClassName = "bg-slate-100",
}) => {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 ">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {label}
                    </p>
                    {subtitle && (
                        <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>
                    )}
                </div>
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBgClassName}`}
                >
                    {icon}
                </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
    );
};
