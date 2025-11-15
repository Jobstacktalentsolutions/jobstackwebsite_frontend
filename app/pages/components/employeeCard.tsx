import React from "react";

const HighlightedEmployeeCard = () => {
    return (
        <aside className="rounded-2xl bg-white border border-slate-100 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                    <p className="text-sm font-semibold">David O.</p>
                    <p className="text-xs text-slate-500">Driver</p>
                </div>
            </div>

            <dl className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                    <dt>Position:</dt>
                    <dd className="font-medium text-slate-800">Driver</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Date Hired:</dt>
                    <dd className="font-medium text-slate-800">October 15, 2024</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Monthly Salary:</dt>
                    <dd className="font-medium text-slate-800">₦85,000</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Contact:</dt>
                    <dd className="font-medium text-slate-800">080X XXX XXXX</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Next of Kin:</dt>
                    <dd className="font-medium text-slate-800">Adeola O. (Spouse)</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Status:</dt>
                    <dd className="font-medium text-emerald-600">Active</dd>
                </div>
            </dl>

            <button className="mt-4 w-full rounded-full bg-blue text-white py-2 text-sm font-medium hover:bg-blue/90 transition-colors">
                View Details
            </button>
        </aside>
    );
};

export default HighlightedEmployeeCard;
