import VerifyClient from "./VerifyClient";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const params = useSearchParams();
    const email = params.get("email") ?? "";

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
