"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Directions from "@/app/assets/directions.svg"
import Review from '@/app/assets/review.svg';
import HireIcon from '@/app/assets/hireIcon.svg';
import Image, { StaticImageData } from "next/image";
type Step = {
    id: string;
    title: string;
    desc: string;
    icon: StaticImageData | string;
};

const STEPS: Step[] = [
    { id: "post", title: "Post Your Role", desc: "List your job requirements in minutes. It’s free to get started.", icon: Directions },
    { id: "review", title: "Review Quality Matches", desc: "Our platform filters and shortlists candidates who fit your needs.", icon: Review },
    { id: "hire", title: "Connect & Hire", desc: "Message candidates, schedule interviews, and make offers—all in one place.", icon: HireIcon },
];

export default function HowItWorks() {
    const ref = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // three separate vertical segments that fill on scroll
    const s1 = useTransform(scrollYProgress, [0.0, 0.33], ["0%", "100%"]);
    const s2 = useTransform(scrollYProgress, [0.33, 0.66], ["0%", "100%"]);
    const s3 = useTransform(scrollYProgress, [0.66, 1.0], ["0%", "100%"]);

    return (
        <section ref={ref} className="mx-auto max-w-5xl px-4 py-16 flex  md:grid  gap-x-6 md:grid-cols-[44px_1fr] font-sans ">
            {/* Left rail with three lines */}
            {/* Left rail with three lines flowing top to bottom */}
            <div className="relative flex flex-col items-center">
                {/* segment 1 */}
                <div className="relative h-40 w-[3px] md:w-[4px] bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 right-0 bg-blue"
                        style={{ height: s1 }}
                    />
                </div>
                <div className="h-2" />

                {/* segment 2 */}
                <div className="relative h-40 w-[3px] md:w-[4px] bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 right-0 bg-blue"
                        style={{ height: s2 }}
                    />
                </div>
                <div className="h-2" />

                {/* segment 3 */}
                <div className="relative h-40 w-[3px] md:w/[4px] bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 right-0 bg-blue"
                        style={{ height: s3 }}
                    />
                </div>
            </div>


            {/* Right content */}
            <div className="space-y-20">
                {STEPS.map((step, i) => {
                    const start = i / 3;
                    const end = (i + 0.6) / 3;
                    const bg = useTransform(
                        scrollYProgress,
                        [start, end],
                        ["rgba(243,244,246,1)", "rgba(219,234,254,1)"] // gray-100 -> blue-100
                    );
                    const title = useTransform(
                        scrollYProgress,
                        [start, end],
                        ["#111827", "#2572A7"] // gray-900 -> blue-800
                    );

                    return (
                        <motion.article key={step.id} className="flex items-start gap-4">
                            <motion.div
                                className="grid place-items-center rounded-xl border p-2 md:p-2.5 border-gray-200 transition-colors"
                                style={{ backgroundColor: bg }}
                            >
                                <Image src={step.icon} alt="icons highlighting hiring process" />
                            </motion.div>

                            <div>
                                <motion.h3 className="text-xl md:text-xl font-semibold" style={{ color: title }}>
                                    {step.title}
                                </motion.h3>
                                <p className="mt-2   text-gray-600">{step.desc}</p>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
}
