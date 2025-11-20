import React from "react";
import EmployerHeader from "@/app/pages/components/employerHeader";
import EmployerStatsRow from "@/app/pages/components/employerStat";
import EmployerMetricSection from "@/app/pages/components/employerMetericSection";
import JobCard from "@/app/pages/components/jobcard";
import HighlightedEmployeeCard from "@/app/pages/components/employeeCard";

const EmployerDashboardPage = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <EmployerHeader />

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-0 py-6">
        <EmployerStatsRow />

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1.1fr]">
          {/* <EmployerMetricSection />
          <HighlightedEmployeeCard /> */}
        </div>

        <div className="flex items-end w-full gap-4">
          <div className="w-3/4">
            <EmployerMetricSection />
            
          </div>
          <div className="w-1/4"><HighlightedEmployeeCard /><HighlightedEmployeeCard />
            <HighlightedEmployeeCard /></div>
       </div>
        <div>
          <h1 className="my-6">Job listings</h1>
          <JobCard
            location="Surulere, Lagos"
            verified
            timePosted="1 day ago"
            title="Childminder / Nanny"
            description="We need a caring and patient nanny for our 2-year-old son while we are at work."
            workType="On-site"
            schedule="Monday – Friday (7am – 5pm)"
            salary="₦35,000 / month"
          />
      </div>
      </section>
    </main>
  );
};

export default EmployerDashboardPage;
