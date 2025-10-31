
import VerifyClient from "./VerifyClient";

export default function VerifyEmailPage({ searchParams }: { searchParams: { email?: string } }) {
    const email = searchParams.email ?? "";

    return (
        <VerifyClient
            heading="Check your e--inbox"
            message={
                <>
                    We sent a 6-digit verification code to{" "}
                    <span className="text-blue-600">{email}</span>. Please enter it below to continue.
                </>
            }
            email={email}
           
        />
    );
}
