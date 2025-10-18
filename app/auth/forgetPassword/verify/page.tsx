// app/auth/forgetPassword/verify/page.tsx

import VerifyClient from "./VerifyClient";

export default function Page() {
    // You can fetch the email from server context/session if needed
    const email = "user@example.com";

    return (
        <VerifyClient
            heading="Check your e-inbox"
            message={
                <>
                    <p> We sent a 6-digit verification code to{" "}
                        <span className="text-blue-600">{email}</span>. Please enter it below to continue.
                    </p>
                </>
            }
            email={email}
        />
    );
}
