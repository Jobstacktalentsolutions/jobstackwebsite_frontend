"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

type CarouselProps = {
    images: (StaticImageData | string)[];
    /** ms between slides (autoplay). Set 0 to disable. */
    interval?: number;
    className?: string;
    showArrows?: boolean;
    showDots?: boolean;
};

export default function Carousel({
    images,
    interval = 5000,
    className,
    showArrows = true,
    showDots = true,
}: CarouselProps) {
    const [index, setIndex] = useState(0);
    const len = images.length;
    const clamp = (i: number) => (i + len) % len;

    // autoplay
    useEffect(() => {
        if (!interval) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % len), interval);
        return () => clearInterval(id);
    }, [interval, len]);

    // swipe
    const startX = useRef<number | null>(null);
    const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
    const onTouchEnd = (e: React.TouchEvent) => {
        if (startX.current == null) return;
        const delta = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(delta) > 40) setIndex((i) => clamp(i + (delta < 0 ? 1 : -1)));
        startX.current = null;
    };

    const go = (dir: 1 | -1) => setIndex((i) => clamp(i + dir));

    return (
        <div
            className={cn("fixed h-full w-[750px] overflow-hidden", className)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="carousel"
        >
            {/* Track */}
            <div
                className="flex h-full w-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {images.map((src, i) => (
                    <div key={i} className="relative h-full w-full shrink-0">
                        <Image
                            src={src}
                            alt={`Slide ${i + 1}`}
                            fill
                            sizes="(min-width:600px) 50vw, 100vw"
                            className=" rounded-3xl object-cover [object-position:50%_20%]"
                            priority={i === 0}
                        />
                    </div>
                ))}
            </div>

            {/* Arrows */}
            {showArrows && len > 1 && (
                <>
                    <button
                        aria-label="Previous slide"
                        onClick={() => go(-1)}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur hover:bg-black/45"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        aria-label="Next slide"
                        onClick={() => go(1)}
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur hover:bg-black/45"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && len > 1 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                i === index ? "bg-white" : "bg-white/50"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
