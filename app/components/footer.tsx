import { ArrowUp, Circle } from "lucide-react";
import Link from "next/link";

const linkStyle =
    "text-slate-600 hover:text-slate-900 transition-colors";

export default function Footer() {
    return (
        <footer className="bg-white" id="site-footer">
            <div className="mx-auto max-w-6xl px-4 pb-12 pt-14">
                <div className="grid gap-10 md:grid-cols-12">
                    {/* Brand / about */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-2">
                            {/* Simple “three-circles” logo */}
                            <div className="flex -space-x-2">
                                <Circle className="h-6 w-6 text-sky-500" />
                                <Circle className="h-6 w-6 text-teal-500" />
                                <Circle className="h-6 w-6 text-indigo-500" />
                            </div>
                            <span className="text-xl font-semibold text-slate-900">
                                Jobstack
                            </span>
                        </div>

                        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                            Jobstack is where Nigeria works. We&apos;re building a trusted community that helps
                            people find their next paycheck and helps businesses find their most valuable asset: people.
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-700">
                            <a href="#top" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-50">
                                Back to top
                                <ArrowUp className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    <nav className="md:col-span-7 grid grid-cols-1 text-center sm:grid-cols-3 gap-4 sm:gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li><Link href="/" className={linkStyle}>Home</Link></li>
                                <li><Link href="/partners" className={linkStyle}>Partners</Link></li>
                                <li><Link href="/about" className={linkStyle}>About us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Support</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li><Link href="/contact" className={linkStyle}>Contact us</Link></li>
                                <li><Link href="/blog" className={linkStyle}>Blogs</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Jobs</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li><Link href="/jobs/low-skilled" className={linkStyle}>Low-skilled</Link></li>
                                <li><Link href="/jobs/high-skilled" className={linkStyle}>High-skilled</Link></li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <hr className="mt-12 border-slate-200" />
                <div className="mt-6 text-xs text-slate-500">
                    © {new Date().getFullYear()} Jobstack. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
