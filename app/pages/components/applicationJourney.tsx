// components/ApplicationJourney.tsx
import React from "react";

export const ApplicationJourney: React.FC = () => {
    return (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">
                    Your Application Journey
                </h2>
                <button className="whitespace-nowrap rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100">
                    Track All Applications
                </button>
            </div>

            {/* Stage tabs */}
            <div className="mt-1 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                <button className="rounded-full bg-slate-900 px-3 py-1.5 text-white">
                    Applied
                </button>
                <button className="rounded-full bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
                    Interviews
                </button>
                <button className="rounded-full bg-slate-50 px-3 py-1.5 hover:bg-slate-100">
                    Offers
                </button>
            </div>

            {/* Timeline-style blocks */}
            <div className="mt-3 space-y-4">
                {/* Applied row */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.7}
                            >
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="M7 9h10" />
                            </svg>
                            Applied
                        </span>
                        <span className="text-[11px]">10 applications</span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-700">
                                Customer Service Rep
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                                22nd October, 2025 · 9:30AM
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-700">
                                Retail Assistant
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                                18th October, 2025 · 8:37AM
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-700">
                                Office Assistant
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">ProBiz Ltd</p>
                        </div>
                    </div>
                </div>

                {/* Upcoming interviews */}
                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.7}
                            >
                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                <path d="M8 3v4M16 3v4M3 11h18" />
                            </svg>
                            Upcoming Interviews
                        </span>
                        <span className="text-[11px]">2 scheduled</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <span className="font-medium text-slate-700">
                                Customer Service Rep · Lagos
                            </span>
                            <span className="text-slate-500">
                                24th October, 2025 · 10:00AM
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <span className="font-medium text-slate-700">
                                Office Assistant · ProBiz Ltd
                            </span>
                            <span className="text-slate-500">
                                27th October, 2025 · 1:30PM
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
