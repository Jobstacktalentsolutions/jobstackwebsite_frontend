import React from "react";

const EmployerMetricSection = () => {
    return (
        <section className="rounded-2xl bg-white border border-slate-100 p-4 md:p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Employment Metric
                </h2>

                <div className="flex items-center gap-3">
                    <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs md:text-sm">
                        <option>November 19th to 25th</option>
                    </select>

                    <div className="flex rounded-lg border border-slate-200 text-xs overflow-hidden">
                        <button className="px-3 py-1.5 bg-blue text-white">Days</button>
                        <button className="px-3 py-1.5 text-slate-500">Months</button>
                        <button className="px-3 py-1.5 text-slate-500">Year</button>
                    </div>
                </div>
            </div>

            {/* Chart placeholder – plug in Recharts or whatever later */}
            <div className="h-60 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                Chart goes here
            </div>
        </section>
    );
};

export default EmployerMetricSection;
