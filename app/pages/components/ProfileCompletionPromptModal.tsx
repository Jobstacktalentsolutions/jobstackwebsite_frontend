"use client";

import { UserRole } from "@/app/lib/enums";
import { useRouter } from "next/navigation";
import Button from "@/app/pages/components/button";

interface ProfileCompletionPromptModalProps {
  open: boolean;
  onClose: () => void;
  role: UserRole;
  title?: string;
  description?: string;
  proceedLabel?: string;
  cancelLabel?: string;
  redirectPath?: string;
}

export function ProfileCompletionPromptModal({
  open,
  onClose,
  role,
  title,
  description,
  proceedLabel,
  cancelLabel,
  redirectPath,
}: ProfileCompletionPromptModalProps) {
  const router = useRouter();

  if (!open) return null;

  const defaultTitle =
    title ||
    (role === UserRole.EMPLOYER
      ? "Complete your company profile"
      : "Complete your profile to continue");

  const defaultDescription =
    description ||
    (role === UserRole.EMPLOYER
      ? "We need a few company details and verification documents before you can post jobs."
      : "Finish setting up your profile so employers have enough information when you apply.");

  const destination =
    redirectPath ||
    (role === UserRole.EMPLOYER
      ? "/pages/employer/auth/complete-profile"
      : "/pages/jobseeker/auth/complete-profile");

  const handleProceed = () => {
    onClose?.();
    router.push(destination);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide">
            Action required
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            {defaultTitle}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {defaultDescription}
          </p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            Completing your profile helps us verify your information and keeps
            our marketplace safe for everyone.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            {cancelLabel || "Maybe later"}
          </Button>
          <Button type="button" className="flex-1" onClick={handleProceed}>
            {proceedLabel || "Complete profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}

type ModalWrapperProps = Omit<ProfileCompletionPromptModalProps, "role">;

export function JobApplicationProfilePromptModal(props: ModalWrapperProps) {
  return (
    <ProfileCompletionPromptModal
      role={UserRole.JOB_SEEKER}
      title={
        props.title || "Complete your profile to apply for this opportunity"
      }
      description={
        props.description ||
        "Tell us more about your experience so employers can evaluate your application."
      }
      {...props}
    />
  );
}

export function JobPostingProfilePromptModal(props: ModalWrapperProps) {
  return (
    <ProfileCompletionPromptModal
      role={UserRole.EMPLOYER}
      title={props.title || "Complete your profile to post jobs"}
      description={
        props.description ||
        "We need company information and required documents before we can publish your job."
      }
      {...props}
    />
  );
}
