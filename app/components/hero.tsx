import Image from 'next/image';
import Link from 'next/link';

import star from '../assets/star.svg';
import roundedStar from '../assets/roundStar.svg';
import ai_people from '../assets/heroimage.png';
import bluerainbow from '../assets/bluerainbow.svg';

export default function Hero() {
    return (
        <section className="relative bg-brand" id="top">
            {/* Decorative top border */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

            <div className="relative mx-auto max-w-7xl px-4 pb-0 pt-20 sm:px-6 md:pt-28 lg:px-8 lg:pb-8 lg:pt-32">
                {/* Headline */}
                <h1 className="mx-auto max-w-9xl text-center text-[28px]/[1.2] font-semibold tracking-tight text-white sm:text-5xl lg:text-5xl">
                    Find Your Dream Job
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> or </span>
                    <span className="block">Hire Top Talent</span>
                </h1>

                {/* Subcopy */}
                <p className="mx-auto mt-4 max-w-xl text-center text-[15px]/6 text-white/85 sm:text-lg">
                    A better way to connect talented people with great opportunities.
                    Whether you&apos;re taking the next step in your career or building
                    your dream team, we&apos;re here to make it happen.
                </p>

                {/* CTAs (pill buttons side-by-side on mobile) */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        href="#"
                        className="rounded-[18px] bg-white px-6 py-3 text-center text-[16px] font-semibold text-[#2572A7] shadow hover:shadow-md"
                    >
                        Search Jobs
                    </Link>
                    <Link
                        href="#"
                        className="rounded-[18px] border border-white/70 px-6 py-3 text-center text-[16px] font-semibold text-white hover:bg-white/10"
                    >
                        Post a Job
                    </Link>
                </div>

                {/* Visual area */}
                <div className="relative mt-8 md:mt-16">
                    {/* Gradient backdrop (hidden on mobile) */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-6 hidden h-[420px] sm:block md:h-[520px]"
                    >
                        <Image
                            src={bluerainbow}
                            alt="blue gradient rainbow"
                            fill
                            className="object-contain object-bottom"
                        />
                    </div>

                    {/* People image */}
                    <div className="relative bottom-0 mx-auto h-[380px] w-full max-w-[620px] sm:h-[380px] md:h-[440px] lg:h-[480px]">
                        <Image
                            src={ai_people}
                            alt="Black man and woman in corporate attire"
                            fill
                            priority
                            className="relative z-20 object-contain object-bottom"
                        />

                        {/* MOBILE overlapping cards (absolute inside image box) */}
                        <div className="absolute left-3 bottom-4 z-20 w-[210px] rounded-2xl bg-white p-4 pt-2 shadow-card sm:hidden">
                            <div className="text-[18px] font-semibold">4.5</div>
                            <div className="mt-1 flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        className={i < 4 ? 'fill-yellow-400' : 'fill-yellow-300'}
                                    >
                                        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.853 1.417 8.262L12 19.771l-7.417 4.092L6 15.601 0 9.748l8.332-1.73z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-slate-600">
                                We are trusted by professionals all over the world
                            </p>
                        </div>

                        <div className="absolute right-3 bottom-35 z-20 w-[230px] rounded-2xl bg-white p-4 shadow-card sm:hidden">
                            <div className="flex -space-x-2">
                                {[
                                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
                                    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop',
                                    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop',
                                ].map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                                    />
                                ))}
                            </div>
                            <div className="mt-2 text-xl font-semibold">2K+</div>
                            <p className="mt-1 text-xs text-slate-600">
                                Connect with talented individuals for jobs and hiring
                            </p>
                        </div>
                    </div>

                    {/* DESKTOP/TABLET floating cards (use your previous positions) */}
                    <div className="hidden md:mt-0 md:pointer-events-none md:absolute md:left-6 md:top-10 md:block">
                        <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-card md:animate-[slow-bounce]">
                            <div className="text-2xl font-semibold">4.5</div>
                            <div className="mt-2 flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        className={i < 4 ? 'fill-yellow-400' : 'fill-yellow-300'}
                                    >
                                        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.853 1.417 8.262L12 19.771l-7.417 4.092L6 15.601 0 9.748l8.332-1.73z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="mt-3 text-sm text-slate-600">
                                We are trusted by professionals all over the world
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:mt-0 md:pointer-events-none md:absolute md:right-6 md:top-0 md:block">
                        <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-card md:animate-[slow-bounce]">
                            <div className="flex -space-x-2">
                                {[
                                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
                                    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop',
                                    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop',
                                ].map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt="Avatar"
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
                                    />
                                ))}
                            </div>
                            <div className="mt-3 text-2xl font-semibold">2K+</div>
                            <p className="mt-1 text-sm text-slate-600">
                                Connect with talented individuals for jobs and hiring
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative sparkles (hide on small) */}
                <div
                    aria-hidden
                    className="pointer-events-none relative left-6 top-10 hidden h-12 w-12 rotate-12 md:block lg:left-20 lg:top-24 lg:h-16 lg:w-16"
                >
                    <Image src={roundedStar} alt="spark" fill className="object-contain" />
                </div>
                <div
                    aria-hidden
                    className="pointer-events-none absolute right-8 top-16 hidden h-8 w-8 md:block lg:right-40 lg:top-24 lg:h-10 lg:w-10"
                >
                    <Image src={star} alt="spark small" fill className="object-contain" />
                </div>
            </div>
        </section>
    );
}
