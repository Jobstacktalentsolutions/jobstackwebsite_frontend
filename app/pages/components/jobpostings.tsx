// components/JobsFeed.tsx
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import tinystar from "@/app/assets/tinyStar.svg";
import verified from '@/app/assets/verified.svg'
import globe from '@/app/assets/globe.svg'

type Job = {
    id: string;
    company: string;
    companyAvatar: string;
    verified?: boolean;
    location: string;
    posted: string;
    title: string;
    summary: string;
    tags: string[];
    pay?: string;
};

const JOBS: Job[] = [
    {
        id: '1',
        company: 'John Doe',
        companyAvatar:
            'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Lagos, Nigeria',
        posted: '2 hours ago',
        title: 'Frontend Developer (React)',
        summary:
            "We’re looking for a passionate frontend developer to join our growing team. You’ll work on cutting-edge projects for international clients...",
        tags: ['Remote', 'Full Time'],
        pay: '₦350,000 – ₦500,000/month',
    },
    {
        id: '2',
        company: 'David cane',
        companyAvatar:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Abuja, Nigeria',
        posted: '1 day ago',
        title: 'UX/UI Designer',
        summary:
            'Seeking a talented UX/UI designer to enhance user experiences for our digital products. Collaborate with developers to create intuitive interfaces...',
        tags: ['On-site', 'Part Time'],
        pay: '₦150,000 – ₦250,000/month',
    },
    {
        id: '3',
        company: 'Adeola Francis',
        companyAvatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop',
        verified: false,
        location: 'Port Harcourt, Nigeria',
        posted: '3 days ago',
        title: 'Data Analyst',
        summary:
            'Join us as a data analyst to interpret complex datasets and drive strategic decisions. Your insights will be crucial for our expansion...',
        tags: ['Hybrid', 'Contract'],
        pay: '₦400,000 – ₦600,000/month',
    },
    {
        id: '4',
        company: 'Tunde Festus',
        companyAvatar:
            'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=128&auto=format&fit=crop',
        verified: false,
        location: 'Computer Village, Ikeja',
        posted: '1 day ago',
        title: 'Shop Attendant',
        summary:
            'Help needed in a small phone accessory shop. Good for someone who likes talking to people.',
        tags: ['On-site', 'Full-time (8am – 6pm)'],
        pay: '₦35,000 / month',
    },
    {
        id: '5',
        company: 'Biodun Charles',
        companyAvatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Victoria Island, Lagos',
        posted: '1 week ago',
        title: 'Software Developer',
        summary:
            'Join our dynamic team as a Software Developer. We’re seeking innovative thinkers to contribute to exciting projects in a fast-paced environment...',
        tags: ['Remote', 'Full-time'],
        pay: '₦120,000 – ₦150,000 / month',
    },
    {
        id: '6',
        company: 'Efiok Mfonobong',
        companyAvatar:
            'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Lekki, Lagos',
        posted: '3 days ago',
        title: 'Project Manager',
        summary:
            'We are looking for a skilled Project Manager to oversee renewable energy projects. This role requires excellent leadership and ...',
        tags: ['Hybrid', 'Full-time'],
        pay: '₦100,000 – ₦120,000 / month',
    },
    {
        id: '7',
        company: 'Emeka Esther',
        companyAvatar:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=128&auto=format&fit=crop',
        verified: false,
        location: 'Surulere, Lagos',
        posted: '1 day ago',
        title: 'Childminder / Nanny',
        summary:
            'We need a caring and patient nanny for our 2-year-old son while we are at work.',
        tags: ['On-site', 'Monday – Friday (7am – 5pm)'],
        pay: '₦35,000 / month',
    },
    {
        id: '8',
        company: 'Chinonso Ugochukwu',
        companyAvatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Victoria Island, Lagos',
        posted: '3 days ago',
        title: 'Sales Representative',
        summary:
            'Seeking an enthusiastic person for our cosmetics brand. Must have a flair for beauty...',
        tags: ['On-site', 'Full-time (9am – 5pm)'],
        pay: '₦40,000 / month',
    },
    {
        id: '9',
        company: 'Olamide Adebayo',
        companyAvatar:
            'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Ikeja, Lagos',
        posted: '1 week ago',
        title: 'Data Entry Clerk',
        summary:
            'Looking for detail-oriented individuals for data management tasks. Ideal for those skilled in...',
        tags: ['Remote', 'Part-time (Flexible hours)'],
        pay: '₦25,000 / month',
    },
];

// Helpers
function Dot() {
    return <span className="mx-2 inline-block h-1 w-1 rounded-full bg-slate-300 align-middle" />;
}

function Check() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-emerald-500">
            <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
        </svg>
    );
}

function ArrowLeft() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path
                d="M9 18l6-6-6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// Job Card
function JobCard({ job }: { job: Job }) {
    return (
        <div>

            <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_15px_50px_-25px_rgba(2,6,23,0.2)]">
                {/* Company Row */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <Image
                            src={job.companyAvatar}
                            alt={`${job.company} avatar`}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                            <div className="flex items-center gap-1">
                                <p className="truncate text-sm font-medium text-slate-800">{job.company}</p>
                                {job.verified && <Image src={verified} alt='green tick mark showing verification' />}
                            </div>
                            <p className="truncate text-xs font-extralight text-slate-500">{job.location}</p>
                        </div>
                    </div>
                    <p className="whitespace-nowrap text-xs text-slate-500 flex"><Image src={globe} alt='globe' className='mx-1' /><p>{job.posted}</p></p>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-[17px] font-semibold leading-snug text-slate-900">{job.title}</h3>

                {/* Summary */}
                <p className="mt-2 line-clamp-2 font-extralight text-sm text-slate-600">{job.summary}</p>

                {/* Footer Meta */}
                <div className="mt-4 flex flex-wrap justify-between items-center gap-y-2 text-[12px] text-slate-600 font-extralight">
                    {job.tags.map((t, i) => (
                        <div key={i} className="flex items-center">
                            <span className="whitespace-nowrap">{t}</span>
                            {i < job.tags.length - 1 && <Dot />}
                        </div>
                    ))}
                    {job.pay && (
                        <>
                            <Dot />
                            <span className="whitespace-nowrap font-extralight text-slate-600">{job.pay}</span>
                        </>
                    )}
                </div>
            </article>
        </div>
    );
}

// Main Feed
const PAGE_SIZE = 6;

export default function JobsFeed() {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(JOBS.length / PAGE_SIZE);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentJobs = useMemo(() => JOBS.slice(start, end), [start, end]);

    const goPrev = () => {
        if (page > 1) setPage(page - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goNext = () => {
        if (page < totalPages) setPage(page + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="relative">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="header my-15 flex flex-col items-center">
                    <div className='border border-gray-200 px-4 py-4 rounded-full flex '><Image src={tinystar} alt='tiny star' className='mr-2' /> <p>Job listings</p></div>
                    <h1 className='capitalize font-medium text-5xl my-4 tracking-loose '>Find job a you&apos;ll love</h1>
                    <p className='font-extralight text-gray-500'>Your skills are in demand let&apos;s find where</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {currentJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
                    <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ArrowLeft /> Prev
                    </button>

                    <button
                        onClick={goNext}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 rounded-full bg-[#2F76B6] px-8 py-3 text-base font-semibold text-white shadow-[0_12px_30px_-8px_rgba(47,118,182,0.55)] hover:shadow-[0_16px_40px_-12px_rgba(47,118,182,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next <ArrowRight />
                    </button>
                </div>

                <p className="mt-4 text-center text-sm text-slate-500">
                    Page <span className="font-medium text-slate-700">{page}</span> of{' '}
                    <span className="font-medium text-slate-700">{totalPages}</span>
                </p>
            </div>
        </section>
    );
}
