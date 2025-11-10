// app/profile/page.tsx or pages/profile.tsx
import React from "react";
import Image from 'next/image';
import profileImage from '@/app/assets/profileImage.svg'
import editIcon from '@/app/assets/editIcon.svg'
import threedots from '@/app/assets/threedots.svg';
import calendar from '@/app/assets/calendar.svg';
import location from '@/app/assets/locationPin.svg';
import documentIcon from '@/app/assets/documentIcon.svg'
const tagBase =
    "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700";

const cardBase =
    "bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6";

const sectionTitle = "flex items-center justify-between mb-3 text-sm font-semibold text-slate-900";

const ProfilePage: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-100">
            <div className="">
                {/* Top banner */}
                <div className="bg-gradient-to-r from-sky-900 to-sky-700 px-6 pb-10 md:pb-24  pt-8 mb-10 md:px-10 md:mb-20">
                    {/* Decorative stripes, optional */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-40 opacity-20">
                        <div className="h-full bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_60%)]" />
                    </div>

                    <header className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between  h-full">
                        {/* Left: avatar and basic info */}
                        <div className="flex text-[#717680] md:absolute w-full items-start gap-4 md:gap-6 bottom-0 md:-bottom-[150px] ">
                            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/70 bg-slate-200 md:h-24 md:w-24">
                                <Image src={profileImage} alt="dark skinned man as the profile picture" />
                            </div>

                            <div className="text-white">
                                <div className="flex flex-wrap items-center gap-2 pb-2">
                                    <h1 className="text-2xl font-semibold md:text-3xl ">
                                        Chinedu Okoro
                                    </h1>
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        Approved
                                    </span>
                                </div>
                                <p className="mt-1 text-white md:text-[#717680] text-sm md:text-sm">
                                    Customer Service Representative
                                </p>
                                <div>
                                    <Image src={location } alt="location"/>
                                    <p className="mt-1 text-xs text-white md:text-[#717680]  md:text-sm">
                                        Ikeja, Lagos
                                    </p>
                                </div>
                               
                            </div>
                        </div>

                        {/* Right: actions */}
                        <div className="flex w-full flex-wrap items-center gap-3 justify-end">
                            <button className=" flex items-center rounded-lg bg-white  px-4 py-2 text-xs font-medium text-blue backdrop-blur hover:bg-white/80">
                                <p >  Edit Profile</p>
                                <Image className="mx-4"  src={editIcon} alt="edit icon" width={15} height={15}/>
                            </button>
                            <button className="rounded-lg border border-white/70  bg-[#2572A7] px-4 py-2 text-xs font-medium text-white 
                            hover:bg-white/80">
                                Share Profile
                            </button>
                            <button
                                className="flex h-9 w-9 items-center justify-center rounded-lg  bg-white  hover:bg-white/90"
                                aria-label="More options"
                            >
                                <Image src={threedots} alt="three dots" />
                            </button>
                        </div>
                    </header>
                </div>

                {/* Content */}
                <div className=" px-4 pb-8 md:px-8 md:pb-10 ">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Left column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* About me */}
                            <section className={cardBase}>
                                <div className={sectionTitle}>
                                    <span className="text-2xl"> About me</span>
                                    <Image src={editIcon} alt="edit icon" />
                                </div>
                                <p className="text-sm leading-relaxed text-[#717680]">
                                    A reliable and punctual professional with over 2 years of
                                    experience in customer facing roles. Skilled in handling client
                                    inquiries, managing office records, and using MS Office suite
                                    efficiently. Passionate about delivering excellent customer
                                    service and maintaining organised work environments.
                                </p>
                            </section>

                            {/* Work history */}
                            <section className={cardBase}>
                                <div className={sectionTitle}>
                                    <span className=" text-2xl">Work History</span>
                                    <Image src={editIcon} alt="edit icon" />
                                </div>

                                <div className="space-y-5 text-sm text-slate-800">
                                    {/* Job 1 */}
                                    <div className="flex flex-col border-b border-slate-100 py-4 last:border-b-0 last:pb-0">

                                        <p className="text-sm">Sales Assistant</p>


                                        <p className="text-sm text-slate-500 my-2">Fashion Hub Ltd.</p>
                                        <div className="flex  flex-col ">
                                            <div className="flex ">
                                                <Image src={calendar} alt="calendar" className="mr-2" />
                                                <p className="text-sm text-slate-500">
                                                    Jan 2022 – Present
                                                </p></div>
                                            <p className="mt-2 text-sm text-slate-500">
                                                Managing customer inquiries, processing sales transactions,
                                                and maintaining store inventory. Achieved 95 percent
                                                customer satisfaction rating.
                                            </p>
                                        </div>
                                        </div>

                                        {/* Job 2 */}
                                        <div className="flex flex-col">

                                            <p className="text-lg">Front Desk Officer</p>
                                            <p className="text-sm text-slate-500 my-2">SwiftPay Nigeria</p>
                                            <div className="flex">
                                                <Image src={calendar} alt="calendar" className="mr-2" />
                                                <p className="text-sm text-slate-500">
                                                    Jun 2020 – Dec 2021
                                                </p>
                                            </div>


                                            <p className="mt-2 text-sm text-slate-500">
                                                Handled reception duties, managed visitor logs, and
                                                coordinated office supplies. Supported team of more than
                                                15 employees.
                                            </p>
                                        </div>
                                    </div>
                            </section>

                            {/* Education */}
                            <section className={cardBase}>
                                <div className={sectionTitle}>
                                    <span className="text-2xl">Education</span>
                                    <Image src={editIcon} alt="edit icon" />
                                </div>
                                <div className="text-sm text-slate-800">
                                    <p className="font-semibold">
                                        Diploma in Business Administration
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Lagos City Polytechnic
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">2018 – 2020</p>
                                </div>
                            </section>

                            {/* Where you have applied */}
                            <section className={cardBase}>
                                <h2 className="text-2xl">
                                    Where You have Applied
                                </h2>

                                <div className="space-y-3 mt-2 text-sm text-slate-500">
                                    <ApplicationRow
                                        role="Front Desk Officer"
                                        company="TechFlow NG"
                                        status="Pending"
                                        statusTone="pending"
                                    />
                                    <ApplicationRow
                                        role="Customer Rep"
                                        company="SwiftPay"
                                        status="Rejected"
                                        statusTone="rejected"
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Right column */}
                        <div className="space-y-6">
                            {/* Quick facts */}
                            <section className={cardBase}>
                                <div className={sectionTitle}>
                                    <span className="text-2xl">Quick Facts</span>
                                    <Image src={editIcon} alt="edit icon" />
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400">
                                            Preferred Location
                                        </p>
                                        <p className="mt-1 text-slate-800">Ikeja, Lagos</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400">
                                            Expected Salary
                                        </p>
                                        <p className="mt-1 text-slate-800">
                                            ₦80,000 – ₦120,000 / month
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Skills */}
                            <section className={cardBase}>
                                <div className={sectionTitle}>
                                    <span className="text-2xl">Skills</span>
                                    <Image src={editIcon} alt="edit icon" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Customer Support",
                                        "Customer Service",
                                        "Sales",
                                        "Marketing",
                                        "Human Resources",
                                        "Finance",
                                        "Product Development",
                                        "Design",
                                    ].map((skill) => (
                                        <span key={skill} className={tagBase}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Verified documents */}
                            <section className={cardBase}>
                                <div className={sectionTitle}>
                                    <span className="text-2xl">Verified Documents</span>
                                    <Image src={editIcon} alt="edit icon" />
                                </div>

                                <ul className="space-y-2 text-sm text-slate-800">
                                    <li>Government ID</li>
                                    <li>Reference Letter</li>
                                </ul>

                                <button className="mt-4 w-full rounded-xl bg-sky-50 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-100">
                                    Upload New Document
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};


interface ApplicationRowProps {
    role: string;
    company: string;
    status: "Pending" | "Rejected" | string;
    statusTone: "pending" | "rejected";
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({
    role,
    company,
    status,
    statusTone,
}) => {
    const badgeClasses =
        statusTone === "pending"
            ? "bg-amber-50 text-amber-700 border border-amber-100"
            : "bg-rose-50 text-rose-700 border border-rose-100";

    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div>
                <p className=" font-semibold text-slate-900">{role}</p>
                <p className=" text-slate-500">{company}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1  font-medium ${badgeClasses}`}>
                {status}
            </span>
        </div>
    );
};

export default ProfilePage;
