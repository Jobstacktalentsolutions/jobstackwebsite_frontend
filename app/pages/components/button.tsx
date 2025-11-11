import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import React from "react";

const button = cva(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                primary: "bg-[#2572A7] text-white hover:shadow-md focus:ring-[#2572A7]/40",
                outline:
                    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
                ghost: "text-slate-700 hover:bg-slate-100",
            },
            size: {
                sm: "px-3 py-2 text-sm",
                md: "px-4 py-3 text-base",
                lg: "px-5 py-4 text-base",
            },
            full: { true: "w-full" },
            pill: { true: "rounded-2xl" },
        },
        defaultVariants: { variant: "primary", size: "md" },
    }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof button>;

export default function Button({ className, variant, size, full, pill, ...props }: ButtonProps) {
    return <button className={cn(button({ variant, size, full, pill }), className)} {...props} />;
}
