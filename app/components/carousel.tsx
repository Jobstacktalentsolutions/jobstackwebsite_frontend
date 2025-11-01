"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

type Variant = "slide" | "fade";

type CarouselProps = {
    images: (StaticImageData | string)[];
    interval?: number;
    className?: string;
    showArrows?: boolean;
    showDots?: boolean;
    pauseOnHover?: boolean;
    variant?: Variant;
    enabled?: boolean;
    initialIndex?: number;
    onIndexChange?: (index: number) => void;
    objectPosition?: string;
    sizes?: string;
};

export default function Carousel({
    images,
    interval = 5000,
    className,
    showArrows = true,
    showDots = true,
    pauseOnHover = true,
    variant = "slide",
    enabled = true,
    initialIndex = 0,
    onIndexChange,
    objectPosition = "50% 20%",
    sizes = "(min-width:700px) 50vw, 100vw",
}: CarouselProps) {
    // Hooks always run
    const len = images?.length ?? 0;
    const [index, setIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [pageHidden, setPageHidden] = useState(false);
    const startX = useRef<number | null>(null);

    useEffect(() => {
        const safeInitial = Math.min(Math.max(initialIndex, 0), Math.max(len - 1, 0));
        setIndex(safeInitial);
    }, [len, initialIndex]);

    useEffect(() => {
        onIndexChange?.(index);
    }, [index, onIndexChange]);

    useEffect(() => {
        const handler = () => setPageHidden(document.hidden);
        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    }, []);

    const clamp = (i: number) => (i + len) % Math.max(len, 1);
    const go = (dir: 1 | -1) => setIndex((i) => clamp(i + dir));
    const goTo = (i: number) => setIndex(clamp(i));

    const hasImages = enabled && len > 0;
    const canNav = len > 1;
    const isSlide = variant === "slide";

    useEffect(() => {
        if (!hasImages || !interval || !canNav) return;
        if ((pauseOnHover && hovered) || pageHidden) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % len), interval);
        return () => clearInterval(id);
    }, [hasImages, interval, canNav, pauseOnHover, hovered, pageHidden, len]);

    const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
    const onTouchEnd = (e: React.TouchEvent) => {
        if (startX.current == null) return;
        const delta = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(delta) > 40) setIndex((i) => clamp(i + (delta < 0 ? 1 : -1)));
        startX.current = null;
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!canNav) return;
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
    };

    if (!hasImages) return null;

    return (
        <div
            className={cn("relative h-full w-full overflow-hidden outline-none", className)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => pauseOnHover && setHovered(true)}
            onMouseLeave={() => pauseOnHover && setHovered(false)}
            onKeyDown={onKeyDown}
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="Image carousel"
        >
            {isSlide ? (
                <div
                    className="flex h-full w-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {images.map((src, i) => (
                        <div key={i} className="relative min-h-[9vh] w-full shrink-0">
                            <Image
                                src={src}
                                alt={`Slide ${i + 1}`}
                                fill
                                sizes={sizes}
                                className="rounded-3xl object-cover"
                                style={{ objectPosition }}
                                priority={i === 0}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative min-h-[95vh] w-full">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-500",
                                i === index ? "opacity-100" : "opacity-0"
                            )}
                            aria-hidden={i !== index}
                        >
                            <Image
                                src={src}
                                alt={`Slide ${i + 1}`}
                                fill
                                sizes={sizes}
                                className="rounded-3xl object-cover"
                                style={{ objectPosition }}
                                priority={i === 0}
                            />
                        </div>
                    ))}
                </div>
            )}

            {showArrows && canNav && (
                <>
                    <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => go(-1)}
                        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur hover:bg-black/45"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => go(1)}
                        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur hover:bg-black/45"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                    </button>
                </>
            )}

            {showDots && canNav && (
                <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={cn("h-1.5 w-1.5 rounded-full", i === index ? "bg-white" : "bg-white/50")}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
