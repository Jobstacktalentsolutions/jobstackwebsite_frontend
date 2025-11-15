import React from "react";
import EmployerHeader from "@/app/pages/components/employerHeader";
import EmployerStatsRow from "@/app/pages/components/employerStat";
import EmploymentMetricSection from "@/app/pages/components/employerMetericSection";
import HighlightedEmployeeCard from "@/app/pages/components/employeeCard";

const EmployerDashboardPage = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <EmployerHeader />

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-0 py-6">
        <EmployerStatsRow />

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1.1fr]">
          <EmploymentMetricSection />
          <HighlightedEmployeeCard />
        </div>
      </section>
    </main>
  );
};

export default EmployerDashboardPage;
