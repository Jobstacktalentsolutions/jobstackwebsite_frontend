// app/dashboard/page.tsx
import { authedFetch } from "../lib/authFetch";
import Link from "next/link";

export default async function Dashboard() {
    const res = await authedFetch("/user/me");
    if (res.status === 401) {
        // no token -> redirect to login
        return (
            <main className="p-6">
                <p>Session expired.</p>
                <Link href="/login" className="underline">Login</Link>
            </main>
        );
    }
    const data = await res.json();

    return (
        <main className="p-6">
            <h1 className="text-2xl">Welcome {data?.data?.user?.email}</h1>
        </main>
    );
}
