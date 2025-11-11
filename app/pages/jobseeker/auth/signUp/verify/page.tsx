import VerifyClient from "./VerifyClient";

export default function VerifyEmailPage({
    searchParams,
}: {
    searchParams: { email?: string };
}) {
    const email = searchParams.email ?? "";

    return (
        <VerifyClient
            heading="Check Your Inbox"
            email={email}
        />
    );
}
