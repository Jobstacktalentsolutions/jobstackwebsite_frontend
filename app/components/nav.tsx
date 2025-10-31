'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.svg';

function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="TalentHub" className="h-8 w-auto" priority />
            <span className="sr-only">TalentHub</span>
        </Link>
    );
}

export default function Nav() {
    const [open, setOpen] = useState(false);

    // Close on viewport upsize
    useEffect(() => {
        const handler = () => {
            if (window.innerWidth >= 768) setOpen(false);
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const DesktopLinks = () => (
        <ul className="flex flex-col gap-3 md:gap-6 md:flex-row md:items-center">
            <li>
                <Link
                    className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                    href="/"
                >
                    Home
                </Link>
            </li>
            <li>
                <Link
                    className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                    href="#"
                >
                    About
                </Link>
            </li>
            <li>
                <Link
                    className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                    href="#"
                >
                    Browse jobs
                </Link>
            </li>
            <li>
                <Link
                    className="text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 font-medium"
                    href="#"
                >
                    Blog
                </Link>
            </li>
        </ul>
    );

    return (
        <header className="absolute inset-x-0 top-0 z-50 border-b border-white/20">
            <nav
                className="mx-auto flex max-w-7xl items-center  justify-between py-4 sm:px-6 lg:px-8"
                aria-label="Primary"
            >
                <Logo />

                {/* Desktop nav (center) */}
                <div className="hidden  md:flex md:justify-center ">
                    <DesktopLinks />
                </div>

                {/* Right actions (desktop) */}
                <div className="hidden md:flex md:flex-none items-center gap-4">
                    <Link className="text-white font-medium" href="/dashboard/employers">
                       View employer&rsquo;s dashboard
                    </Link>
                    <Link
                        href="/auth/signUp?persona=jobseeker"
                        className="rounded-xl bg-[#E6F2F9] px-4 py-2 text-blue-500 font-semibold"
                    >
                        Sign up
                    </Link>
                    <Link
                        href="/auth/login"
                        className="rounded-xl bg-[#E6F2F9] px-4 py-2 text-blue-500 font-semibold"
                    >
                        Log in
                    </Link>
                </div>

                {/* Mobile toggler */}
                <button
                    onClick={() => setOpen(v => !v)}
                    className="md:hidden inline-flex items-center rounded-md p-2 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor">
                        {open ? (
                            <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile sheet (matches mock) */}
            <div
                id="mobile-menu"
                className={[
                    'md:hidden fixed inset-0 z-[60] transition-all duration-200 ease-out',
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                ].join(' ')}
            >
                {/* Backdrop (subtle) */}
                <div
                    className="absolute inset-0 bg-black/5"
                    onClick={() => setOpen(false)}
                    aria-hidden
                />

                {/* Panel */}
                <div className="absolute inset-x-0 top-0 bg-white h-full">
                    {/* Top bar with close */}
                    <div className="flex items-center justify-end px-4 py-4 border-b border-slate-200">
                        <button
                            onClick={() => setOpen(false)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path
                                    d="M6 6l12 12M6 18L18 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Centered nav items */}
                    <div className="flex h-[calc(100%-56px)] flex-col items-center justify-start gap-8 pt-8">
                        {/* Active Home pill */}
                        <Link
                            href="/"
                            className="rounded-full bg-slate-100 px-6 py-2 text-slate-800 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="#"
                            className="text-slate-700"
                            onClick={() => setOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="#"
                            className="text-slate-700"
                            onClick={() => setOpen(false)}
                        >
                            Browse jobs
                        </Link>
                        <Link
                            href="#"
                            className="text-slate-700"
                            onClick={() => setOpen(false)}
                        >
                            Contact
                        </Link>

                        {/* Primary action */}
                        <Link
                            href="/auth/signUp"
                            className="mt-6 inline-flex w-[220px] items-center justify-center rounded-2xl bg-[#2F76B6] px-6 py-3 text-white font-semibold shadow-[0_12px_30px_-8px_rgba(47,118,182,0.55)]"
                                                   >
                            Sign up
                        </Link>
                        <Link
                            href="/auth/login"
                            className="mt-6 inline-flex w-[220px] items-center border-[2px] justify-center rounded-2xl text-[#2F76B6] px-6 py-3 bg-white font-semibold shadow-[0_12px_30px_-8px_rgba(47,118,182,0.55)]"
                        >
                           Log in
                        </Link>

                        {/* Employers link (green) */}
                        <Link
                            href="#"
                            className="mt-2 text-emerald-600 font-semibold"
                            onClick={() => setOpen(false)}
                        >
                            View the employer&apos;s dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
