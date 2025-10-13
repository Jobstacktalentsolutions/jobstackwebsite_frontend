'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import star from '../assets/tinyStar.svg';

type Testimonial = {
    name: string;
    role: string;
    company: string;
    avatar: string;
    rating: number; // 1–5
    text: string;
    verified?: boolean;
};

const DATA: Testimonial[] = [
    {
        name: 'Amina B.',
        role: 'Project Manager',
        company: 'TechFlow NG',
        avatar:
            'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&auto=format&fit=crop',
        rating: 4,
        text:
            `After being laid off, I was struggling. Within two weeks on this platform, I had three solid interviews. I now work as a Project Manager at a top fintech company. This platform didn’t just give me a job; it gave me a career path.`,
        verified: true,
    },
    {
        name: 'Daniel K.',
        role: 'Senior Backend Engineer',
        company: 'PayStacker',
        avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop',
        rating: 5,
        text:
            `Super easy profile setup and real roles. I got two offers in 10 days. The matching felt accurate and cut the noise.`,
        verified: true,
    },
    {
        name: 'Ada E.',
        role: 'Product Designer',
        company: 'NovaLabs',
        avatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
        rating: 5,
        text:
            `Hiring is finally structured. We filled two roles fast, and the candidates were genuinely vetted. Will use again.`,
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
                    className={i < n ? 'fill-yellow-400' : 'fill-slate-400/40'}
                >
                    <path d="M12 .587l3.668 7.431L24 9.748l-6 5.853 1.417 8.262L12 19.771l-7.417 4.092L6 15.601 0 9.748l8.332-1.73z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0); // 0–100

    const updateProgress = () => {
        const el = scrollerRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const ratio = max > 0 ? el.scrollLeft / max : 0;
        setProgress(Math.min(100, Math.max(0, ratio * 100)));
    };

    const scrollByAmount = (dir: 'left' | 'right') => {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = Math.min(640, Math.round(el.clientWidth * 0.9));
        el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        updateProgress();
        el.addEventListener('scroll', updateProgress, { passive: true });

        const ro = new ResizeObserver(updateProgress);
        ro.observe(el);

        return () => {
            el.removeEventListener('scroll', updateProgress);
            ro.disconnect();
        };
    }, []);

    return (
        <section className="relative bg-brand">
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

            <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                {/* Layout wrapper: stack on mobile, two columns on lg+ */}
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
                    {/* Left: heading + CTAs */}
                    <div className="lg:col-span-4">
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-sm text-black">
                                <Image src={star} alt="star" />
                                Testimonials
                            </span>

                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                                What Do Our Clients Say
                            </h2>

                            <p className="mt-3 max-w-sm text-white/80">
                                Don’t just take our word for it. Hear from those who’ve found success.
                            </p>

                            
                        </div>
                    </div>

                    {/* Right: carousel */}
                    <div className="relative lg:col-span-8">
                        {/* Edge fades (hide on mobile to save paint) */}
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
                                    className="snap-center shrink-0 w-[88%] xs:w-[80%] sm:w-[380px] md:w-[460px] lg:w-[520px]
                             rounded-3xl bg-white/5 p-5 md:p-7 ring-1 ring-white/10 backdrop-blur-xl
                             shadow-[0_20px_60px_-15px_rgba(2,6,23,0.45)]"
                                >
                                    <div className="flex items-start gap-4">
                                        <Image
                                            src={t.avatar}
                                            alt={`${t.name} avatar`}
                                            width={48}
                                            height={48}
                                            className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                                        />
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white">{t.name}</div>
                                            <div className="text-sm text-white/80">{t.role}</div>
                                            <div className="text-sm text-white/60">at {t.company}</div>
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                                        <Stars n={t.rating} />
                                        <p className="mt-3 text-white/90">“{t.text}”</p>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
                                        {t.verified && (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-white">
                                                    <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
                                                </svg>
                                                <span>Verified</span>
                                            </>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                            <button
                                onClick={() => scrollByAmount('left')}
                                aria-label="Previous"
                                className="rounded-full bg-white/10 px-4 py-2 text-white ring-1 ring-white/20 hover:bg-white/20"
                            >
                                ‹
                            </button>

                            {/* Progress track */}
                            <div className="relative h-1 w-40 overflow-hidden rounded-full bg-white/20 sm:w-56 md:w-72">
                                <div
                                    className="h-full rounded-full bg-white/70 transition-[width] duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <button
                                onClick={() => scrollByAmount('right')}
                                aria-label="Next"
                                className="rounded-full bg-white/10 px-5 py-2 text-white ring-1 ring-white/20 hover:bg-white/20"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 flex w-full lg:flex-col gap-3 sm:flex-row">
                        <a
                            href="#jobs"
                            className="w-full rounded-xl bg-white px-5 py-3 text-center font-semibold text-[#2572A7] shadow hover:shadow-md sm:w-auto"
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
            </div>
        </section>
    );
}
