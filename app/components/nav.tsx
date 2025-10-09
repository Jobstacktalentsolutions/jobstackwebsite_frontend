'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import  logo  from "../assets/logo.svg";

function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            {/* Simple triple-circle logo */}
            <Image src={logo } alt="logo"/>
            <span className="sr-only">TalentHub</span>
        </Link>
    )
}

export default function Nav() {
    const [open, setOpen] = useState(false)

    const NavLinks = () => (
        <ul className="flex flex-col gap-8 md:flex-row  md:justify-center  ">
            <li><Link className="text-white/90 hover:text-white py-2   px-4 rounded-xl  hover:bg-white/20 font-semibold text-lg" href="/">Home</Link></li>
            <li><Link className="text-white/90 hover:text-white  py-2  px-4 rounded-xl  hover:bg-white/20 font-semibold text-lg" href="#">About</Link></li>
            <li><Link className="text-white/90 hover:text-white  py-2  px-4 rounded-xl  hover:bg-white/20 font-semibold text-lg" href="#">Browse jobs</Link></li>
            <li><Link className="text-white/90 hover:text-white py-2   px-4 rounded-xl  hover:bg-white/20 font-semibold text-lg" href="#">Blog</Link></li>
          
        </ul>
    )

    return (
        <header className="absolute pointer-events-none inset-x-0 top-0 z-50 border-b-2 border-white">
            <nav className="pointer-events-none mx-auto flex max-w-7xl items-center  px-4 py-4 sm:px-6 lg:px-8 ">
                <Logo />

                {/* <button
                    onClick={() => setOpen(v => !v)}
                    className="md:hidden rounded-md p-2 text-white/90 hover:bg-white/10"
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button> */}

                <div className="hidden md:flex justify-center w-10/12">
                    <NavLinks />
                </div>
                <div className='flex items-center w-/12'>
                    
                        <Link
                            className="text-white text-lg font-semibold"
                            href="#"
                        >
                            View employer's dashboard
                        </Link>
                    
                    <button className="bg-[#E6F2F9] text-blue-400 w-24 p-2 mx-4 rounded-xl">Sign in </button>
                </div>
            </nav>

            {/* mobile panel */}
            {open && (
                <div className="mx-4 mt-2 rounded-2xl bg-white/10 p-4 md:hidden backdrop-blur">
                    <NavLinks />
                </div>
            )}
        </header>
    )
}
