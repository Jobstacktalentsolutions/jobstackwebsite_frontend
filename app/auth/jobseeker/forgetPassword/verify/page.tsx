import VerifyClient from "./VerifyClient";
import  AuthPageLayout from "@/app/components/AuthPageLayout";
export default async function Page({ searchParams }: { searchParams: { email?: string } }) {
  const params = await searchParams;
  const email = params?.email ?? "";

  return (
    <AuthPageLayout heading="Check your e-inbox" message={
      <VerifyClient
      
        message={
          <>
            <p>
              
              We sent a 6-digit verification code to{" "}
              <span className="text-blue-600">{email}</span>. <br/> Please enter it
              below to continue.
            </p>
          </>
        }
        email={email}
      />
      }/>
  
  );
}
