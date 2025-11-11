// components/ProfileStrength.tsx
import React from "react";

export const ProfileStrength: React.FC = () => {
    return (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight">Profile Strength</h2>
            <p className="text-sm text-slate-600">
                You are most likely to be hired for:
            </p>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                    OA
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                        Office Assistant
                    </span>
                    <span className="text-xs text-slate-500">ProBiz Ltd</span>
                </div>
            </div>

            <div className="mt-2 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600">Profile completeness</span>
                    <span className="text-xs font-medium text-emerald-600">80%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-4/5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs text-slate-500">
                    Add more skills and work experience to improve your chances.
                </div>
            </div>

            <button className="mt-auto inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800">
                Improve Profile
            </button>
        </section>
    );
};
