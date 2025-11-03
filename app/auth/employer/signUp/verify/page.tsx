import VerifyClient from "./VerifyClient";

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email = "" } = await searchParams; // ✅ await before using

    return <VerifyClient heading="Check Your Inbox" email={email} />;
}

// (optional, if you set metadata here, it must also await)
export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email } = await searchParams;
    return {
        title: email ? `Verify ${email}` : "Verify your email",
        // metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    };
}
