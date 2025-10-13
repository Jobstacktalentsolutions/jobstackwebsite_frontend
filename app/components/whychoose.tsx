// components/WhyChooseUs.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import graph from '../assets/graph.svg';
import placeholder from '../assets/image.png';
import bluePeople from "../assets/blueIconPeople.svg";
import verified from '../assets/verified.svg';
import dashboard from "../assets/dashboardIcon.svg";
import star from '../assets/tinystar.svg';

type Card = {
    title: string;
    desc: string;
    image?: StaticImageData | string ;
    icon: StaticImageData | string;
};

const cards: Card[] = [
    {
        title: "Smarter, Matching",
        desc:
            "Our platform connects the right talent with the right companies—without the guesswork.",
        image: placeholder,
        icon: bluePeople
    },
    {
        title: "Real Opportunities, Real People",
        desc:
            "Verified profiles and job listings. No spam, no fake posts.",
        image: placeholder,
        icon:verified
    },
    {
        title: "Simple & Efficient",
        desc:
            "One profile for all applications. One dashboard for all hiring.",
        image: placeholder,
        icon: dashboard
    },
];

export default function WhyChooseUs() {
    return (
        <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
            {/* Pill */}
            <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white p-4 text-sm text-slate-700 ">
                  <Image src={star} alt="black star"/>
                    Why Choose Us?
                </span>
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Better Connections, Better Results
            </h2>
            <p className="mt-3 text-center text-slate-500">
                Your Partner in Career and Hiring Success.
            </p>

            {/* Cards */}
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, i) => (
                    <article
                        key={i}
                        className="relative rounded-[2rem] bg-slate-200 overflow-hidden transform transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl"
                    >
                        {/* Background image (cropped) */}
                        <div className="relative h-[460px] w-full">
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-500 ease-out hover:scale-110"
                                priority={i === 1}
                                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                            />

                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/40" />
                        </div>

                        {/* Glass overlay card */}
                        <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/50 bg-white/10 transition-all duration-500 ease-out">
                            <div className="pointer-events-auto flex flex-col gap-3 p-5 pb-0">
                                <span className={`grid h-7 w-7 place-items-center rounded-lg ${card.iconBg}`}>
                                    <Image src={card.icon} alt="" />
                                </span>
                                <h3 className="text-xl font-semibold text-white drop-shadow ">
                                    {card.title}
                                </h3>
                            </div>
                            <p className="mt-2 px-5 text-sm text-white/90">{card.desc}</p>

                            {/* squiggle / mini chart */}
                            <Image src={graph} alt="vector of a line graph" width={500} height={500} />
                        </div>

                        {/* Outer soft shadow */}
                        <div className="absolute inset-0 rounded-[2rem] ring-1 ring-black/5 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.35)]" />
                    </article>
                ))}
            </div>

        </section>
    );
}
