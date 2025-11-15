"use client";

import React, { useState, useEffect } from "react";

interface SalaryEditorProps {
  minSalary?: number;
  maxSalary?: number;
  onSave: (min: number | undefined, max: number | undefined) => Promise<void>;
  renderInput: (
    min: number | undefined,
    max: number | undefined,
    onMinChange: (min: number | undefined) => void,
    onMaxChange: (max: number | undefined) => void
  ) => React.ReactNode;
  isEditing?: boolean;
  onEditToggle?: () => void;
  showMobileModal?: (title: string, content: React.ReactNode) => void;
  closeMobileModal?: () => void;
}

// Salary editor component
export const SalaryEditor: React.FC<SalaryEditorProps> = ({
  minSalary: initialMin,
  maxSalary: initialMax,
  onSave,
  renderInput,
  isEditing,
  onEditToggle,
  showMobileModal,
  closeMobileModal,
}) => {
  const [minSalary, setMinSalary] = useState<number | undefined>(initialMin);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(initialMax);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setMinSalary(initialMin);
    setMaxSalary(initialMax);
  }, [initialMin, initialMax]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) {
      return `₦${min.toLocaleString()} – ₦${max.toLocaleString()} / month`;
    }
    if (min) {
      return `₦${min.toLocaleString()}+ / month`;
    }
    if (max) {
      return `Up to ₦${max.toLocaleString()} / month`;
    }
    return "Not specified";
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(minSalary, maxSalary);
      if (onEditToggle) {
        onEditToggle();
      }
    } catch (error) {
      console.error("Error saving salary:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setMinSalary(initialMin);
    setMaxSalary(initialMax);
    if (onEditToggle) {
      onEditToggle();
    }
    if (closeMobileModal) {
      closeMobileModal();
    }
  };

  if (isEditing && !isMobile) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-slate-400">
          Expected Salary
        </p>
        <div className="space-y-3">
          {renderInput(minSalary, maxSalary, setMinSalary, setMaxSalary)}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                "Done"
              )}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isMobile && showMobileModal) {
    const modalContent = (
      <div className="space-y-4">
        <div className="space-y-3">
          {renderInput(minSalary, maxSalary, setMinSalary, setMaxSalary)}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );

    return (
      <div className="group relative">
        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">
          Expected Salary
        </p>
        <div className="flex items-start justify-between gap-2">
          <p className="text-slate-800">{formatSalary(minSalary, maxSalary)}</p>
          <button
            onClick={() =>
              showMobileModal("Edit Expected Salary", modalContent)
            }
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-all"
            aria-label="Edit salary"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <p className="text-xs font-semibold uppercase text-slate-400 mb-1">
        Expected Salary
      </p>
      <p className="text-slate-800">{formatSalary(minSalary, maxSalary)}</p>
    </div>
  );
};
