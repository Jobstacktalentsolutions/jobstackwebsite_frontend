"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import editIcon from "@/app/assets/editIcon.svg";

interface InlineEditableProps {
  value: string | ReactNode;
  onSave: (value: string) => Promise<void>;
  renderInput: (value: string, onChange: (value: string) => void) => ReactNode;
  isEditing?: boolean;
  onEditToggle?: () => void;
  label?: string;
  placeholder?: string;
  className?: string;
  mobileModalTitle?: string;
  showMobileModal?: (title: string, content: ReactNode) => void;
}

// Inline editable component for desktop, modal for mobile
export const InlineEditable: React.FC<InlineEditableProps> = ({
  value,
  onSave,
  renderInput,
  isEditing: externalIsEditing,
  onEditToggle: externalOnEditToggle,
  label,
  placeholder = "Click to edit",
  className = "",
  mobileModalTitle = "Edit",
  showMobileModal,
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(
    typeof value === "string" ? value : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof value === "string") {
      setEditValue(value);
    }
  }, [value]);

  const handleEdit = () => {
    if (isMobile && showMobileModal) {
      // Show modal on mobile
      const modalContent = (
        <div className="space-y-4">
          {label && (
            <label className="block text-sm font-medium text-slate-700">
              {label}
            </label>
          )}
          {renderInput(editValue, setEditValue)}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                // Close modal - this will be handled by parent
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                "Save"
              )}
            </button>
          </div>
        </div>
      );
      showMobileModal(mobileModalTitle, modalContent);
    } else {
      // Inline edit on desktop
      if (externalOnEditToggle) {
        externalOnEditToggle();
      } else {
        setInternalIsEditing(true);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editValue);
      if (externalOnEditToggle) {
        externalOnEditToggle();
      } else {
        setInternalIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(typeof value === "string" ? value : "");
    if (externalOnEditToggle) {
      externalOnEditToggle();
    } else {
      setInternalIsEditing(false);
    }
  };

  if (isEditing && !isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {label && (
          <label className="block text-xs font-semibold uppercase text-slate-400">
            {label}
          </label>
        )}
        <div className="flex-1">{renderInput(editValue, setEditValue)}</div>
        <div className="flex gap-2 pt-2">
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
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {label && (
        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">
          {label}
        </p>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {typeof value === "string" ? (
            <p className="text-slate-800">
              {value || (
                <span className="text-slate-400 italic">{placeholder}</span>
              )}
            </p>
          ) : (
            value
          )}
        </div>
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-all"
          aria-label="Edit"
        >
          <Image src={editIcon} alt="edit" width={16} height={16} />
        </button>
      </div>
    </div>
  );
};
