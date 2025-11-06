"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import star from "../assets/tinyStar.svg";
import grid from '../assets/grid.svg';
type Testimonial = {
    name: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
    text: string;
    verified?: boolean;
};

const DATA: Testimonial[] = [
    {
        name: "Amina B.",
        role: "Project Manager",
        company: "TechFlow NG",
        avatar:
            "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&auto=format&fit=crop",
        rating: 4,
        text:
            "After being laid off, I was struggling. Within two weeks on this platform, I had three solid interviews. I now work as a Project Manager at a top fintech company. This platform didn’t just give me a job; it gave me a career path.",
        verified: true,
    },
    {
        name: "Daniel K.",
        role: "Senior Backend Engineer",
        company: "PayStacker",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
        rating: 5,
        text:
            "Super easy profile setup and real roles. I got two offers in 10 days. The matching felt accurate and cut the noise.",
        verified: true,
    },
    {
        name: "Ada E.",
        role: "Product Designer",
        company: "NovaLabs",
        avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
        rating: 5,
        text:
            "Hiring is finally structured. We filled two roles fast, and the candidates were genuinely vetted. Will use again.",
        verified: true,
    },
];

function Stars({ n }: { n: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className={i < n ? "fill-yellow-400" : "fill-slate-400/40"}
                >
                    <path d="M12 .587l3.668 7.431L24 9.748l-6 5.853 1.417 8.262L12 19.771l-7.417 4.092L6 15.601 0 9.748l8.332-1.73z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    // throttle updates
    const lastUpdateRef = useRef<number>(0);
    const updateProgress = () => {
        const now = Date.now();
        if (now - lastUpdateRef.current < 100) {
            return;
        }
        lastUpdateRef.current = now;

        const el = scrollerRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const ratio = max > 0 ? el.scrollLeft / max : 0;
        setProgress(Math.min(100, Math.max(0, ratio * 100)));
    };

    const scrollByAmount = (dir: "left" | "right") => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = Math.min(640, Math.round(el.clientWidth * 0.9));
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        updateProgress();
        el.addEventListener("scroll", updateProgress, { passive: true });

        const ro = new ResizeObserver(() => updateProgress());
        ro.observe(el);

        return () => {
            el.removeEventListener("scroll", updateProgress);
            ro.disconnect();
        };
    }, []);

    return (
        <section className="relative bg-brand">
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

            <div className="relative  px-4 py-4 sm:px-6 lg:px-8">
                <div className="grid ml-20 my-15  gap-10 md:flex md:items-center  w-full ">
                    <div className="flex flex-col justify-between w-1/2">
                        <div className="flex flex-col  justify-between text-center lg:items-start lg:text-left">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-4 text-sm text-black">
                                <Image src={star} alt="star" width={16} height={16} /> Testimonials
                            </span>

                            <h2 className="mt-4 text-4xl font-semibold tracking-tight leading-normal text-white sm:text-4xl md:text-5xl">
                                What Do Our <br/> Clients Say
                            </h2>

                            <p className="mt-3 font-thin text-white/80">
                                Don’t just take our word for it. Hear from those who’ve found success.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3 ">
                            <a
                                href="#jobs"
                                className="w-full rounded-xl bg-white px-5 py-3 text-center font-light text-[#2572A7] shadow hover:shadow-md sm:w-auto"
                            >
                                Search Jobs
                            </a>
                            <a
                                href="#post"
                                className="w-full rounded-xl border border-white/40 px-5 py-3 text-center text-white hover:bg-white/10 sm:w-auto"
                            >
                                Post a Job
                            </a>
                        </div>
                    </div>

                    <div className="relative w-1/2 lg:col-span-8 ">
                        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-[#1e5b86] to-transparent sm:block" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 bg-gradient-to-l from-[#1e5b86] to-transparent sm:block" />

                        <div
                            ref={scrollerRef}
                            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 sm:gap-6 sm:py-4"
                            aria-label="Client testimonials"
                        >
                            {DATA.map((t, idx) => (
                                <article
                                    key={idx}
                                    className="snap-center shrink-0 w-[80%] max-w-[620px] rounded-3xl bg-white/5 p-5 md:py-7 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(2,6,23,0.45)] flex"
                                >
                                    <div className="flex w-1/3 flex-col item gap-4 ">
                                        <Image
                                            src={t.avatar}
                                            alt={`${t.name} avatar`}
                                            width={48}
                                            height={48}
                                            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                                        />
                                        <div className="min-w-0 ">
                                            <div className="font-semibold text-white">{t.name}</div>
                                            <div className="text-sm text-white/80">{t.role}</div>
                                            <Image src={grid} alt="transparent grid patterns"/>
                                        </div>
                                        {t.verified && (
                                            <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
                                                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-white">
                                                    <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
                                                </svg>
                                                <span>Verified</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 w-2/3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                                        <Stars n={t.rating} />
                                        <p className="mt-3 text-white/90">“{t.text}”</p>
                                    </div>

                                 
                                </article>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                            

                            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/20 sm:w-56 md:w-72">
                                <div
                                    className="h-full rounded-full bg-white/70 transition-[width] duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            
                        </div>

                     
                    </div>
                </div>
            </div>
        </section>
    );
}
