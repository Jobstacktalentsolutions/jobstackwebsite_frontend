import Image from 'next/image'
import Link from 'next/link'
import star from "../assets/star.svg";
import roundedStar from "../assets/roundStar.svg";
import ai_people from "../assets/image.png";
import bluerainbow from '../assets/bluerainbow.svg';
export default function Hero() {
    return (
        <section className="relative  bg-[#1e5b86]">
            {/* Decorative top border */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />



            <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pb-4 lg:pt-36">
                {/* Headline */}
                <h1 className="mx-auto max-w-3xl text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl pt-18">
                    Find Your Dream Job or Hire Top<br />
                    <span className="text-mist">Vetted Talent</span>
                </h1>

                {/* Subcopy */}
                <p className="mx-auto mt-5 max-w-2xl text-center text-white/80">
                    A better way to connect talented people with great opportunities. Whether you’re taking the next step in your career or building your dream team, we’re here to make it happen.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex justify-center gap-3">
                    <Link
                        href="#"
                        className="rounded-full bg-white px-5 py-3 text-ink shadow hover:shadow-md"
                    >
                        Search Jobs
                    </Link>
                    <Link
                        href="#"
                        className="rounded-full border border-white/40 px-5 py-3 text-white hover:bg-white/10"
                    >
                        Post a Job
                    </Link>
                </div>

                {/* Stat cards + people */}
                <div className="relative mt-16 flex justify-between items-end gap-8">
                    {/* Left rating card */}
                    <div className="order-2 md:order-1 absolute top-50 slow-bounce">
                        <div className="mx-auto w-full max-w-xs rounded-2xl bg-white p-5 shadow-card">
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
                    {/* Middle overlapping people image */}
                    <div className="relative flex justify-center items-center  w-full bg">
                        <div className="order-1 flex justify-center md:order-2  rounded-2xl px-2  ">
                            <div className="relative">
                                {/* backdrop ellipse
                                <Image src={bluerainbow} alt='blue gradient rainbow'/> */}
                                {/* CROPPED IMAGE WRAPPER */}
                                <div className="order-1 flex items-end justify-center md:order-2">
                                    <div className="relative">
                                        {/* backdrop ellipse */}
                                        <div aria-hidden className="absolute  -left-0  -right-20 bottom-0 top-1/3 " > <Image src={bluerainbow} alt='blue gradient rainbow' height={700} width={700} /> </div>
                                        <div className="h-[460px] relative w-full overflow-hidden -bottom-10">
                                            <Image
                                                src={ai_people}
                                                className="relative z-10 w-[650px] -bottom-[0px] max-w-full object-cover"
                                                priority
                                                alt='black man and woman in coperate '
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* Right stat card */}
                    <div className="order-3  absolute top-10 right-10 slow-bounce">
                        <div className="mx-auto w-full max-w-xs rounded-2xl bg-white p-5 shadow-card">
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

                {/* Decorative spark */}
                <div aria-hidden className="pointer-events-none relative left-20 top-48 hidden h-16 w-16 rotate-12 md:block">
                    {/* Background spark / blob */}
                    <Image src={roundedStar} alt='stars' />
                </div>
                <div aria-hidden className="pointer-events-none absolute right-40 top-28 hidden h-10 w-10 md:block">
                    <Image src={star} alt='stars' />
                </div>
            </div>
        </section>
    )
}
