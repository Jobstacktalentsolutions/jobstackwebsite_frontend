'use client';

import { useMemo, useState } from 'react';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import Input from '../components/input'; // adjust path if needed

type PasswordFieldProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    error?: string;
    showHints?: boolean; // default true for create/reset flows; set false on login
    placeholder?: string;
    name?: string;
    id?: string;
};

export default function PasswordField({
    value,
    onChange,
    label = 'Password',
    error,
    showHints = true,
    placeholder = 'Enter password',
    name,
    id,
}: PasswordFieldProps) {
    const [show, setShow] = useState(false);

    const rules = useMemo(
        () => [
            { key: 'len', label: '8 characters', pass: value.length >= 8 },
            { key: 'num', label: 'Number', pass: /\d/.test(value) },
            { key: 'lower', label: 'lowercase', pass: /[a-z]/.test(value) },
            { key: 'upper', label: 'Uppercase', pass: /[A-Z]/.test(value) },
            { key: 'special', label: '1 special character', pass: /[^A-Za-z0-9]/.test(value) },
        ],
        [value]
    );

    return (
        <div>
            <Input
                id={id}
                name={name}
                label={label}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                iconLeft={<Lock size={16} />}
                iconRight={
                    <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                }
                error={error}
            />

            {showHints && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {rules.map((r) => (
                        <span
                            key={r.key}
                            className={
                                r.pass
                                    ? 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm border-slate-400 text-slate-700'
                                    : 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm border-slate-300 text-slate-400'
                            }
                        >
                            {/* blue check badge when passed (matches your mock) */}
                            {r.pass && (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1F5B86] text-white">
                                    <Check size={12} strokeWidth={3} />
                                </span>
                            )}
                            {r.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
