"use client";
import Image from 'next/image'
import icecream from '@/app/assets/icons8-melting-ice-cream-100.png'
import Link from "next/link";
import { usePathname } from "next/navigation";



export default function NotFound() {
    const pathname = usePathname();
    const isEmployer = pathname.includes("employer");

    const backRoute = isEmployer ? "/pages/employer/dashboard" : "/pages/jobseeker/dashboard";
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 text-brand-blue px-6">
            <div className="max-w-md text-center">
                <div className="mx-auto  relative">
                    <Image src={ icecream} alt="melting ice cream image"/>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold my-2">
                    Oh no! wrong page
                </h1>
                <p className="text-sm text-center md:text-base text-slate-700 mb-6">
                    Looks like your ice cream is melting. The page you are looking for does
                    not exist.
                </p>

                <Link
                    href={backRoute}
                className="inline-flex items-center justify-center rounded-md bg-[#2572A7] text-slate-100 text-sm font-medium px-5 py-2.5 hover:bg-[#1e5b86] transition"
                >
                    Go back home
                </Link>
            </div>
    
    );
}
