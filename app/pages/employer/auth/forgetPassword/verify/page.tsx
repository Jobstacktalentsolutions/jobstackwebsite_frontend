import VerifyClient from "./VerifyClient";
import AuthPageLayout from "@/app/pages/components/authPageLayout";
export default function Page({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ?? "";

  return (
    <AuthPageLayout subtext={` We sent a 6-digit verification code to  ${email} Please enter it
              below to continue.`} heading=" Check your e-inbox"
      message={
        <VerifyClient
          heading="Check your e-inbox"
          message={
            <>
              <p className="text-slate-700 text-[14px] my-4 text">

                We sent a 6-digit verification code to{" "}
                <span className="text-blue-600">{email}</span>. <br /> Please enter it
                below to continue.
              </p>
            </>
          }
          email={email}
        />} />
  );
}
