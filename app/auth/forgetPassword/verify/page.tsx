import VerifyClient from "./VerifyClient";

export default function Page({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ?? "";

  return (
    <VerifyClient
      heading="Check your e-inbox"
      message={
        <>
          <p>
            {" "}
            We sent a 6-digit verification code to{" "}
            <span className="text-blue-600">{email}</span>. <br/>Please enter it
            below to continue.
          </p>
        </>
      }
      email={email}
    />
  );
}
