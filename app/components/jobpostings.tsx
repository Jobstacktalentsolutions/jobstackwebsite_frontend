// components/JobsFeed.tsx
'use client';

import Image from 'next/image';

type Job = {
    id: string;
    company: string;
    companyAvatar: string;
    verified?: boolean;
    location: string;
    posted: string;            // e.g. "2 hours ago"
    title: string;
    summary: string;
    tags: string[];            // e.g. ["Remote", "Full-time (8am – 6pm)"]
    pay?: string;              // e.g. "₦350,000 – ₦500,000/m"
};

const JOBS: Job[] = [
    {
        id: '1',
        company: 'TechInnovate Ltd.',
        companyAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Lagos, Nigeria',
        posted: '2 hours ago',
        title: 'Frontend Developer (React)',
        summary:
            "We’re looking for a passionate frontend developer to join our growing team. You’ll work on cutting-edge projects for international clients...",
        tags: ['Remote', 'Full Time'],
        pay: '₦350,000 – ₦500,000/m',
    },
    {
        id: '2',
        company: 'DesignMasters Co.',
        companyAvatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=128&auto=format&fit=crop',
        verified: true,
        location: 'Abuja, Nigeria',
        posted: '1 day ago',
        title: 'UX/UI Designer',
        summary:
            'Seeking a talented UX/UI designer to enhance user experiences for our digital products. Collaborate with developers to create intuitive interfaces...',
        tags: ['On-site', 'Part Time'],
        pay: '₦150,000 – ₦250,000/m',
    },
    {
        id: '3',
        company: 'Insight Corp.',
        companyAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop',
        verified: false,
        location: 'Port Harcourt, Nigeria',
        posted: '3 days ago',
        title: 'Data Analyst',
        summary:
            'Join us as a data analyst to interpret complex datasets and drive strategic decisions. Your insights will be crucial for our expansion...',
        tags: ['Hybrid', 'Contract'],
        pay: '₦400,000 – ₦600,000/m',
    },
    {
        id: '4',
        company: 'Tunde Festus',
        companyAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=128&auto=format&fit=crop',
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
        company: 'Tech Innovations Inc.',
        companyAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop',
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
        company: 'Green Energy Solutions',
        companyAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&auto=format&fit=crop',
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
        company: 'The Adebayos',
        companyAvatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=128&auto=format&fit=crop',
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
        companyAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop',
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
        companyAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=128&auto=format&fit=crop',
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

function JobCard({ job }: { job: Job }) {
    return (
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_15px_50px_-25px_rgba(2,6,23,0.2)]">
            {/* Company row */}
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
                            {job.verified && <Check />}
                        </div>
                        <p className="truncate text-xs text-slate-500">{job.location}</p>
                    </div>
                </div>
                <p className="whitespace-nowrap text-xs text-slate-500">{job.posted}</p>
            </div>

            {/* Title */}
            <h3 className="mt-3 text-[17px] font-semibold leading-snug text-slate-900">
                {job.title}
            </h3>

            {/* Summary */}
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{job.summary}</p>

            {/* Footer meta */}
            <div className="mt-4 flex flex-wrap items-center gap-y-2 text-sm text-slate-600">
                {job.tags.map((t, i) => (
                    <div key={i} className="flex items-center">
                        <span className="whitespace-nowrap">{t}</span>
                        {i < job.tags.length - 1 && <Dot />}
                    </div>
                ))}
                {job.pay && (
                    <>
                        <Dot />
                        <span className="whitespace-nowrap font-medium text-slate-900">{job.pay}</span>
                    </>
                )}
            </div>
        </article>
    );
}

export default function JobsFeed() {
    return (
        <section className="relative">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Grid */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {JOBS.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        </section>
    );
}
