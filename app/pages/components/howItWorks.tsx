"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import tinystar from "@/app/assets/tinyStar.svg";
import howitworks from '@/app/assets/howitworks.png'
import HiringProcess from '@/app/pages/components/hiringprocess'
import Directions from "@/app/assets/directions.svg"
import Review from '@/app/assets/review.svg';
import HireIcon from '@/app/assets/hireIcon.svg';
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
                icon: <Directions />,
            },
            {
                title: "Review Quality Matches",
                desc: "Our platform filters and shortlists candidates who fit your needs.",
                icon: <Review />,
            },
            {
                title: "Connect & Hire",
                desc: "Message candidates, schedule interviews, and make offers—all in one place.",
                icon: <Image src={HireIcon} alt="hireIcon" />,
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
        <section className="bg-white font-sans">
            <div className="flex flex-col items-center my-15 md:my-30">
                <div className="border px-4 py-3 rounded-full border-gray-400 flex"> <Image src={tinystar} alt='tiny black  star' className="mr-2" /> <p>How it works</p></div>
                <h1 className="  text-5xl text-center md:text-start -tracking-normal m-5">Better Talents, Better Results</h1>
                <p className="capitalize ">Streamline your hiring process in 3 steps</p>
            </div>
            <div className="flex flex-col-reverse md:flex-row  w-full justify-evenly items-center">
                <Image src={howitworks} alt='' width={500} className="h-1/2 my-7" />
                <div className=""><HiringProcess /></div>
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


