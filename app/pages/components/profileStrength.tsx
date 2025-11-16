// app/components/ProfileStrength.tsx
'use client';

import Image, { StaticImageData } from 'next/image';
import React from 'react';

type StrengthItem = {
    label: string;
    percent: number; // 0–100
};

type ProfileStrengthProps = {
    title?: string;
    onEdit?: () => void;
    avatarSrc: string | StaticImageData;
    items: StrengthItem[];
};

export default function ProfileStrength({
    title = 'Profile Strength',
    onEdit,
    avatarSrc,
    items,
}: ProfileStrengthProps) {
    return (
        <section className="w-full max-w-[560px]">
            {/* Header */}
            

            {/* Card (solid blue border) */}
            <div className="relative rounded-2xl lg:flex md:flex-col  p-6 bg-white shadow-sm">
                <div className="flex justify-between my-5"><h2 className="text-3xl font-semibold">Profile Strength</h2>
                    <button
                        type="button"

                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Edit
                    </button></div>
                {/* Soft rounded corner shading (subtle) */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 [box-shadow:inset_0_0_0_1px_rgba(59,130,246,0.08)]" />

                {/* Avatar container with dotted outline */}
                <div className="mx-auto mb-6 w-fit rounded-xl border-2 border-dotted border-blue-400/70 p-3">
                    <div className="relative h-28 w-28 rounded-full">
                        <Image
                            src={avatarSrc}
                            alt="Profile photo"
                            fill
                            className="rounded-full object-cover border-4 border-blue-400/80"
                            sizes="112px"
                        />
                    </div>
                </div>

                {/* Items box with dotted outline */}
                <div className="rounded-xl border-2 border-dotted border-blue-400/70 p-4">
                    <ul className="space-y-3">
                        {items.map((item, i) => (
                            <li
                                key={`${item.label}-${i}`}
                                className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3 text-sm sm:text-base"
                            >
                                <span className="text-gray-700">{item.label}</span>
                                <span className="font-semibold text-gray-900">
                                    {Math.round(item.percent)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
