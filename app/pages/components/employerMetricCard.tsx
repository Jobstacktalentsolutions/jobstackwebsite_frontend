import React, { ReactNode } from "react";

type MetricCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
};

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon,
}) => {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-slate-500">{title}</p>
                {icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue/5">
                        {icon}
                    </div>
                )}
            </div>
            <div>
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                {subtitle && (
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default MetricCard;
