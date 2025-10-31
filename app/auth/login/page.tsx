"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Button from "../../components/button";
import Input from "../../components/input";
import google from '../../assets/google.svg';
import apple from "../../assets/apple.svg";
import { useState } from "react";
import Carousel from "@/app/components/carousel";
import welcome from "../../assets/welcomeimage.png";
import welcome2 from "../../assets/welcomeimagetwo.png";
import welcome3 from "../../assets/securitywithstaff.png";
import PasswordField from "@/app/components/passwordField";
import AuthPageLayout from "@/app/components/authPageLayout";

export default function LoginPage() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [pwError, setPwError] = useState<string | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                // headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.message || "Login failed");
            }
            router.replace("/dashboard");
        } catch (e: unknown) {
            let message = "Login failed";

            if (e instanceof Error) {
                message = e.message;
            } else if (typeof e === "object" && e !== null && "message" in e) {
                message = String((e as { message: string }).message);
            }

            setErr(message);
        } finally {
            setLoading(false);
        }
    };
    return (

        <AuthPageLayout
            heading="Welcome back!"
            subtext=" Great to see you again. Pick up right where you left off."
            message={
                <form className="space-y-4" onSubmit={onSubmit}>
                    <Input
                        label="Email Address"
                        placeholder="Enter email address"
                        iconLeft={<Mail size={16} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordField
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (pwError) setPwError(undefined); // clear error as user types
                        }}
                        error={pwError}
                        showHints={false}
                    />
                    <div className=" flex justify-end">
                        <Link href="/auth/forgetPassword/verify/">Forgot password?</Link>
                    </div>
                    {err && <p className="text-red-600">{err}</p>}
                    <Button className="w-full my-10 text-medium" disabled={loading}>
                        {" "}
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <div className="flex items-center gap-2 mb-10">
                        <hr className="flex-grow border-slate-200" />
                        <span className="text-sm text-slate-500">or</span>
                        <hr className="flex-grow border-slate-200" />
                    </div>
                    <div className="flex md:hidden">
                        <div className="flex w-full justify-center ">
                            <button className="flex mx-4  justify-center p-2 rounded-lg border-gray-500 border-[1px]">
                                <Image src={google} alt="google icon" />
                            </button>
                            <button className="flex  justify-center border-gray-500 p-2 rounded-lg border-[1px]"><Image src={apple} alt="apple icon" />
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Don’t have an account?{" "}
                        <Link href="/auth/signUp" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            }
        />
    );
}
