"use client";

import Image from "next/image";
import { Briefcase, ChevronRight, Plus } from "lucide-react";

export default function CTA() {
    return (
        <section className="bg-brand">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
                <div className="rounded-3xl border border-white/10 bg-brand-two p-8 shadow-xl sm:p-12">
                    <div className="grid items-center gap-10 md:grid-cols-2">
                        {/* Left: copy */}
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white text-slate-800 px-3 py-1 text-sm font-medium shadow">
                                <Plus className="h-4 w-4" />
                                Get jobs
                            </div>

                            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                                Find Work That Works
                                <br /> for You
                            </h1>

                            <p className="mt-4 max-w-xl text-slate-200">
                                Browse verified daily gigs, part-time work, and full-time roles in your area.
                                Apply directly, chat with posters, and get hired faster—no complex process, just honest work.
                            </p>

                            <a
                                href="#jobs"
                                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-slate-900 font-medium shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60"
                            >
                                Find Local Jobs
                                <ChevronRight className="h-5 w-5" />
                            </a>
                        </div>

                        {/* Right: image */}
                        <div className="flex justify-center md:justify-end">
                            <div className="relative aspect-[4/5] w-72 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                                <Image
                                    src="/hero.png" // put your image in /public/hero.png
                                    alt="Smiling professional"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
