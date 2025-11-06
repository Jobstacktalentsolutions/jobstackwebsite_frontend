import * as React from "react";
import { cn } from "../lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    id?: string;
    label?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    error?: string;
    valueItem?: string;
};

export default function Input({
    id,
    label,
    iconLeft,
    iconRight,
    error,
    className,
    valueItem,
    ...props
}: InputProps) {
    const generatedId = React.useId();          // ✅ always called
    const inputId = id ?? generatedId;           // pick value conditionally (no hook call)

    return (
        <label htmlFor={inputId} className="block">
            <span className="mb-2 block text-[14px] md:text-base font-sans font-light text-slate-600 ">
                {label}
            </span>

            <div className={cn(
                "relative rounded-xl border bg-white",
                error ? "border-rose-400" : "border-slate-200"
            )}>
                {iconLeft && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-slate-400">
                        {iconLeft}
                    </span>
                )}

                <input
                    id={inputId}
                    value={valueItem}
                    className={cn(
                        "h-12 w-full rounded-xl bg-transparent px-4 text-[16px] text-slate-800 placeholder:text-slate-400 focus:outline-none",
                        !!iconLeft && "pl-10",
                        !!iconRight && "pr-10",
                        className
                    )}
                    {...props}
                />

                {iconRight && (
                    <span className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400">
                        {iconRight}
                    </span>
                )}
            </div>

            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </label>
    );
}
