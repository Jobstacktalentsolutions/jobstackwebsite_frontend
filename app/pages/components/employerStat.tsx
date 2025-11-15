import React from "react";
import MetricCard from "@/app/pages/components/employerMetricCard";
import { BriefcaseBusinessIcon, Users, UserPlus } from "lucide-react";
import { CreditCard } from "lucide-react";

const EmployerStatsRow = () => {
    return (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Jobs Live"
                value={2}
                subtitle=""
                icon={<BriefcaseBusinessIcon className="h-4 w-4 text-orange-500" />}
            />
            <MetricCard
                title="This Month's Payroll"
                value="₦1,240,000"
                subtitle=""
                icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
            />
            <MetricCard
                title="Total Active Staff"
                value={15}
                subtitle="Employees"
                icon={<Users className="h-4 w-4 text-green-600" />}
            />
            <MetricCard
                title="New Hires"
                value={3}
                subtitle="Employees"
                icon={<UserPlus className="h-4 w-4 text-pink-500" />}
            />
        </section>
    );
};

export default EmployerStatsRow;
