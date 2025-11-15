"use client";

import Image from "next/image";
import Button from "./button";
import googleIcon from "@/app/assets/google.svg";

interface GoogleSignInButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  text?: string;
}

// Reusable Google sign-in button component
export default function GoogleSignInButton({
  onClick,
  className = "",
  disabled = false,
  text = "Sign in with Google",
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      className={`flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Image src={googleIcon} alt="Google icon" width={20} height={20} />
      <span>{text}</span>
    </Button>
  );
}
