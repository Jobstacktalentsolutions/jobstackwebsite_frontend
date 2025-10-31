'use client'
import Image from "next/image";
import HowItWorks from '../../components/howItWorks'
import bag from '../../assets/bag.svg';
import book from'../../assets/book.svg';
import cake from'../../assets/cake.svg';
import shop from '../../assets/shop.svg';
import tech from '../../assets/tech.svg';
import house from '../../assets/house.svg';
import office from '../../assets/office.svg';
import { Hospital } from "lucide-react";
import Link from "next/link";
export default function Page() {
    const industries = [
        [cake, 'For Restaurants & Hotels', "List your role requirements in minutes. It's free to get started."],
        [shop, 'For Retail & Sales', 'Easily post your job openings and connect with local talent in no time.'],
        [Hospital, 'For Healthcare Providers', 'Streamline your hiring and find qualified professionals quickly.'],
        [tech, 'For Tech Startups', 'Attract innovative thinkers and expand your team effortlessly.'],
        [bag, 'For Skilled Trades', 'Source drivers, technicians, electricians, and carpenters.'],
        [office, 'For Offices & Corporates', 'Hire receptionists, data entry staff, accountants, and managers.'],
        [book, 'For Educational Institutions', 'Post course details and requirements to attract the right teachers.'],
        [house, 'For Home & Personal Services', 'Hire trustworthy individuals for domestic and personal needs.'],
    ];
    return (
        <main className="min-h-screen text-slate-900 [font-family:Inter,system-ui]">
            {/* NAV */}
            <header className="bg-[#1e5b86] text-white">
                <div className="mx-auto max-w-6xl px-6 md:px-10">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#1e5b86] text-xs font-bold">JS</span>
                                <span className="font-semibold tracking-tight text-white/90">Jobstack</span>
                            </div>
                        </div>
                        <nav className="hidden gap-6 md:flex text-white/90">
                            <a href="#" className="hover:text-white">Home</a>
                            <a href="#" className="hover:text-white">About</a>
                            <a href="#" className="hover:text-white">Find Talent</a>
                            <a href="#" className="hover:text-white">Pricing</a>
                            <a href="#" className="font-semibold text-emerald-200">Employers</a>
                        </nav>
                        <div className="hidden items-center gap-3 md:flex">
                            <Link href="/auth/signUp?persona=employer" className="rounded-full border border-white/60 px-5 py-2 text-sm font-medium hover:bg-white/10">Sign in</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="bg-[#1e5b86]">
                <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
                    <div className="grid items-center gap-10 md:grid-cols-2">
                        <div className="text-white">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#1e5b86]">＋</span>
                                <span>Hire Talents</span>
                            </div>
                            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Hire Quality Talent, Fast.</h1>
                            <p className="mt-4 text-white/80">Post your job to thousands of verified, active job seekers. Fill your roles in days, not months.</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a className="rounded-lg bg-white px-5 py-3 text-[#1e5b86] font-semibold shadow" href="#">Post a Job for Free</a>
                                <a className="rounded-lg border border-white/60 px-5 py-3 text-white/90" href="#">Schedule a Demo</a>
                            </div>
                        </div>
                        <div className="relative mx-auto max-w-md">
                            <div className="rounded-[2rem] bg-white/10 p-3">
                                <div className="relative overflow-hidden rounded-[1.25rem] bg-[#fbfdfe]">
                                    <img src="https://placehold.co/720x720/png" alt="hero" className="h-[360px] w-full object-cover" />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 right-4 w-48 rounded-2xl bg-white p-4 text-[#1e5b86] shadow-xl">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Trusted by</p>
                                <p className="text-3xl font-extrabold">8,000+</p>
                                <p className="text-xs text-slate-500">businesses across Nigeria, from startups to established brands.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
           <HowItWorks/>

            {/* SOLUTIONS STRIP (icons grid) */}
            <section className="bg-[#1e5b86] text-white">
                <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
                    <div className="mx-auto mb-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2">
                        <span>＋</span>
                        <span className="text-sm font-semibold">Testimonials</span>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold md:text-4xl">Solutions for Your Business</h2>
                    <p className="mt-1 text-center text-white/70">Hire for Any Role, Any Sector</p>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {industries.map(([icon, title, desc], i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-5  transition-colors duration-200"
                            >
                                <Image src={icon} alt={title} className="my-4 w-6 h-6" />
                                <h3 className="text-base font-semibold w-full border-2 borderr-red-500">{title}</h3>
                                <p className="mt-2 text-sm text-white/80">{desc}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* FEATURED TALENT */}
            <section className="bg-white">
                <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
                    <div className="mx-auto mb-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#1e5b86]/10 px-4 py-2 text-[#1e5b86]">
                        <span>＋</span>
                        <span className="text-sm font-semibold">Talents</span>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold md:text-4xl">Featured Talent Pool</h2>
                    <p className="mt-1 text-center text-slate-500">Top Candidates Actively Looking</p>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <article key={i} className="rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="h-3 w-3 rounded bg-[#2972a5]" />
                                    <div>
                                        <h3 className="font-semibold">{['Software Engineer', 'Graphic Designer', 'Customer Service Rep'][i % 3]}</h3>
                                        <p className="text-xs text-slate-500">Looking for opportunities to innovate and develop solutions.</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                                    <span>2 years experience</span>
                                    <span>•</span>
                                    <span>Lagos</span>
                                </div>
                                <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                                    <p className="font-medium">Tunde B.</p>
                                    <p className="text-slate-600">Sales Assistant</p>
                                    <p className="text-xs text-slate-500">Hardworking and ready to start immediately.</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <a href="#" className="rounded-lg bg-[#1e5b86] px-5 py-3 text-white shadow">Post a Job for Free</a>
                    </div>
                </div>
            </section>

            {/* BENEFIT NUMBERS + IMAGE */}
            <section className="bg-[#1e5b86] text-white">
                <div className="mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
                    <div className="mx-auto mb-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2">
                        <span>＋</span>
                        <span className="text-sm font-semibold">Testimonials</span>
                    </div>
                    <h2 className="text-center text-3xl font-extrabold md:text-4xl">Solutions for Your Business</h2>
                    <p className="mt-1 text-center text-white/70">Hire for Any Role, Any Sector</p>

                    <div className="mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                        <div className="order-2 text-center md:order-1 md:text-left">
                            <div className="text-center">
                                <p className="text-4xl font-extrabold">1</p>
                                <h3 className="mt-2 font-semibold">Verified Candidates</h3>
                                <p className="text-sm text-white/80">ID-checked profiles with references for peace of mind.</p>
                            </div>
                            <div className="mt-10 text-center">
                                <p className="text-4xl font-extrabold">2</p>
                                <h3 className="mt-2 font-semibold">Smart Matching</h3>
                                <p className="text-sm text-white/80">Algorithm highlights the most qualified applicants for your role.</p>
                            </div>
                        </div>

                        <div className="order-1 mx-auto md:order-2">
                            <div className="rounded-[2rem] bg-white/10 p-3">
                                <img src="https://placehold.co/640x520/png" className="h-[320px] w-[420px] rounded-[1.25rem] object-cover" alt="meeting room" />
                            </div>
                        </div>

                        <div className="order-3 text-center md:text-left">
                            <div className="text-center">
                                <p className="text-4xl font-extrabold">3</p>
                                <h3 className="mt-2 font-semibold">All-in-One Dashboard</h3>
                                <p className="text-sm text-white/80">Manage job posts, applications, and messaging from a single platform.</p>
                            </div>
                            <div className="mt-10 text-center">
                                <p className="text-4xl font-extrabold">4</p>
                                <h3 className="mt-2 font-semibold">Cost-Effective</h3>
                                <p className="text-sm text-white/80">Reach thousands of job seekers with no hidden fees.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA BANNER + FOOTER */}
            <section className="bg-[#20567d]">
                <div className="mx-auto max-w-6xl px-6 md:px-10 py-16">
                    <div className="grid items-center gap-10 rounded-3xl bg-[#1e5b86] px-8 py-10 md:grid-cols-2">
                        <div className="text-white">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#1e5b86]">＋</span>
                                <span>Hire Talents</span>
                            </div>
                            <h3 className="text-3xl font-extrabold leading-tight">Start Hiring Smarter Today</h3>
                            <p className="mt-3 text-white/80">Join thousands of companies saving time and money on recruitment.</p>
                            <div className="mt-6">
                                <a className="rounded-lg bg-white px-5 py-3 font-semibold text-[#1e5b86] shadow" href="#">Post Your First Job</a>
                            </div>
                        </div>
                        <div className="relative mx-auto max-w-xs">
                            <div className="rounded-[2rem] bg-white/10 p-3">
                                <img src="https://placehold.co/520x520/png" className="h-64 w-full rounded-[1.25rem] object-cover" alt="person" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-white">
                <div className="mx-auto max-w-6xl px-6 md:px-10 py-12">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 rounded-full bg-[#1e5b86]/10 px-3 py-2 text-[#1e5b86]">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1e5b86] text-white text-xs font-bold">JS</span>
                                    <span className="font-semibold tracking-tight">Jobstack</span>
                                </div>
                            </div>
                            <p className="mt-4 max-w-sm text-sm text-slate-600">
                                Jobstack is where Nigeria works. We’re building a trusted community that helps people find their next paycheck and helps businesses find their most valuable asset: people.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Company</h4>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Partners</a></li>
                                <li><a href="#">About us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Support</h4>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li><a href="#">Contact us</a></li>
                                <li><a href="#">Blogs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Jobs</h4>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li><a href="#">Low‑skilled</a></li>
                                <li><a href="#">High‑skilled</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <a href="#" className="rounded border border-slate-300 px-2 py-1">Back to top ↑</a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <a href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full border">f</a>
                            <a href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full border">x</a>
                            <a href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full border">in</a>
                        </div>
                    </div>

                    <p className="mt-6 text-xs text-slate-400">© Jobstack Inc. All Rights Reserved.</p>
                </div>
            </footer>
        </main>
    );
}
