"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * HowItWorks – Pixel-match to reference
 * - Sticky rounded image on the left
 * - CENTER TIMELINE made of THREE separate rounded segments
 *   Each segment fills BLUE vertically as its matching step becomes visible.
 * - Right column: icon tiles (rounded square, pale blue) + text
 * Colors from screenshot: deep blue #1e5b86, divider gray #e5e7eb, tile bg #eef6fd
 */
export default function HowItWorks() {
    const steps = useMemo(
        () => [
            {
                title: "Post Your Role",
                desc: "List your job requirements in minutes. It's free to get started.",
                icon: <IconDoc />,
            },
            {
                title: "Review Quality Matches",
                desc: "Our platform filters and shortlists candidates who fit your needs.",
                icon: <IconFilter />,
            },
            {
                title: "Connect & Hire",
                desc: "Message candidates, schedule interviews, and make offers—all in one place.",
                icon: <IconBag />,
            },
        ],
        []
    );

    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState<number[]>(() => steps.map(() => 0));

    const refs = useRef<(HTMLLIElement | null)[]>([]);
    const scrollRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        const nodes = refs.current.filter(Boolean) as HTMLLIElement[];
        if (!nodes.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                const next = [...progress];
                let topIdx = active;
                let max = -1;
                entries.forEach((e) => {
                    const idx = nodes.findIndex((n) => n === e.target);
                    if (idx === -1) return;
                    const vis = (e as any).intersectionRect?.height ?? 0;
                    const total = (e as any).boundingClientRect?.height ?? 1;
                    const ratio = Math.max(0, Math.min(1, vis / total));
                    next[idx] = ratio;
                    if (e.intersectionRatio > max) {
                        max = e.intersectionRatio;
                        topIdx = idx;
                    }
                });
                setProgress(next);
                setActive(topIdx);
            },
            { root: scrollRef.current, threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
        );

        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
                <div className="grid grid-cols-12 items-start gap-10">
                    {/* IMAGE */}
                    <div className="col-span-12 md:col-span-6">
                        <div className="sticky top-24 overflow-hidden rounded-[2rem]">
                            <Image
                                src="https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1600&auto=format&fit=crop"
                                alt="Analyst with futuristic UI"
                                width={1400}
                                height={1000}
                                className="h-[460px] w-full object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* CENTER RAIL – 3 discrete segments with filling blue line */}
                    <div className="relative col-span-1 hidden md:flex md:flex-col md:items-center md:gap-14">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="relative h-[140px] w-[6px] rounded-full bg-[#e5e7eb]">
                                <div
                                    className="absolute left-0 top-0 w-[6px] rounded-full bg-[#1e5b86] transition-[height] duration-300"
                                    style={{ height: `${Math.round((progress[i] || 0) * 100)}%` }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* STEPS */}
                    <div className="col-span-12 md:col-span-5">
                        <ul ref={scrollRef} className="max-h-[520px] overflow-y-auto scroll-smooth snap-y snap-mandatory">
                            {steps.map((s, i) => (
                                <li
                                    key={i}
                                    ref={(el) => (refs.current[i] = el)}
                                    className="snap-start py-12 first:pt-4 last:pb-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <IconTile active={active === i}>{s.icon}</IconTile>
                                        <div>
                                            <h3 className="text-[20px] font-semibold text-slate-900">{s.title}</h3>
                                            <p className="mt-2 max-w-[560px] text-[15px] leading-6 text-slate-600">{s.desc}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

function IconTile({ children, active }: { children: React.ReactNode; active?: boolean }) {
    return (
        <span
            className={
                "inline-flex h-[44px] w-[44px] items-center justify-center rounded-xl text-[#1e5b86] " +
                (active ? "bg-[#dff0ff]" : "bg-[#eef6fd]")
            }
        >
            {children}
        </span>
    );
}

function IconDoc() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
        </svg>
    );
}
function IconFilter() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 3H2l8 9v7l4 2v-9z" />
        </svg>
    );
}
function IconBag() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7h12l1 13H5L6 7Z" />
            <path d="M9 7V6a3 3 0 0 1 6 0v1" />
        </svg>
    );
}
