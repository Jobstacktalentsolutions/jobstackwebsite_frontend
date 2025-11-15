"use client";

import Link from "next/link";
import AuthPageLayout from "@/app/pages/components/authPageLayout";
import { Mail, User2, Phone } from "lucide-react";
import Button from "@/app/pages/components/button";
import Input from "@/app/pages/components/input";
import { useState } from "react";
import PasswordField from "@/app/pages/components/passwordField";
import { empRegister } from "@/app/api/auth-employer.api";
import { toastSuccess, toastError } from "@/app/lib/toast";
import type { EmployerRegistrationDto } from "@/app/types/employer.type";
import { EmployerType } from "@/app/types/employer.type";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/app/pages/components/GoogleSignInButton";

export default function SignUp() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessType, setBusinessType] = useState<
    "Company" | "Individual business" | "Small business"
  >("Company");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [pwError, setPwError] = useState<string | undefined>();
  const [err, setErr] = useState<string | null>(null);

  // Validation
  const isFormValid =
    firstName &&
    lastName &&
    email &&
    phoneNumber &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError(undefined);
    setErr(null);

    if (password !== confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      // Map UI business type to backend enum
      const getEmployerType = (businessType: string): EmployerType => {
        switch (businessType) {
          case "Company":
            return EmployerType.ORGANIZATION;
          case "Individual business":
            return EmployerType.INDIVIDUAL;
          case "Small business":
            return EmployerType.SME;
          default:
            return EmployerType.ORGANIZATION;
        }
      };

      const payload: EmployerRegistrationDto = {
        email: email.toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        type: getEmployerType(businessType),
      };

      await empRegister(payload);
      toastSuccess("Account created successfully! Please verify your email.");
      router.push(
        ` /pages/employer/auth/signUp/verify?email=${encodeURIComponent(email)}`
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Unable to create account";
      setPwError(errorMessage);
      toastError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="">
      <AuthPageLayout
        heading="Start Hiring Today"
        subtext="Create your free employer account in just a minute. Find the perfect talent for your team."
        message={
          <form className="space-y-4 " onSubmit={onSubmit}>
            <div className=" flex flex-col  md:grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                iconLeft={<User2 size={16} />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                iconLeft={<User2 size={16} />}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email Address"
              placeholder="name@company.com"
              iconLeft={<Mail size={16} />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="mb-2 block text-base font-medium text-slate-600">
                Account Type
              </label>
              <div className="flex flex-col w-full   text-gray-500 gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="Company"
                    checked={businessType === "Company"}
                    onChange={() => setBusinessType("Company")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Company</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="Individual business"
                    checked={businessType === "Individual business"}
                    onChange={() => setBusinessType("Individual business")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Individual business</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="Small business"
                    checked={businessType === "Small business"}
                    onChange={() => setBusinessType("Small business")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Small business</span>
                </label>
              </div>
            </div>

            <Input
              label="Phone Number"
              placeholder="e.g., +2348063008035"
              iconLeft={<Phone size={16} />}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <PasswordField
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (pwError) setPwError(undefined);
              }}
              error={pwError}
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (pwError) setPwError(undefined);
              }}
              error={
                password !== confirmPassword && confirmPassword
                  ? "Passwords do not match"
                  : undefined
              }
            />

            <Button
              className="w-full my-10 text-medium"
              disabled={submitting || !isFormValid}
              type="submit"
            >
              {submitting ? "Creating account..." : "Create employer account"}
            </Button>

            {err && (
              <p className="text-red-600 text-sm whitespace-pre-line">{err}</p>
            )}

            <div className="flex items-center gap-2 mb-10">
              <hr className="grow border-slate-200" />
              <span className="text-sm text-slate-500">or</span>
              <hr className="grow border-slate-200" />
            </div>

            <GoogleSignInButton text="Sign up with Google" className="w-full" />

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href=" /pages/employer/auth/login"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        }
      />
    </div>
  );
}
