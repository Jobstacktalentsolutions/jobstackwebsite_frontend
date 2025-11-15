import React, { useState } from "react";
import Image from "next/image";
import editIcon from "@/app/assets/editIcon.svg";

interface InlineEditableProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  renderInput: (
    value: string,
    onChange: (value: string) => void
  ) => React.ReactNode;
  isEditing: boolean;
  onEditToggle: () => void;
  label?: string;
  placeholder?: string;
  showMobileModal: (title: string, content: React.ReactNode) => void;
  mobileModalTitle: string;
  isSaving?: boolean;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
  value,
  onSave,
  renderInput,
  isEditing,
  onEditToggle,
  label,
  placeholder = "Click edit to add information",
  showMobileModal,
  mobileModalTitle,
  isSaving = false,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSave = async () => {
    if (inputValue.trim() !== value.trim()) {
      await onSave(inputValue.trim());
    }
    onEditToggle();
  };

  const handleCancel = () => {
    setInputValue(value);
    onEditToggle();
  };

  const handleMobileEdit = () => {
    setInputValue(value);
    const modalContent = (
      <div className="space-y-4">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        {renderInput(inputValue, setInputValue)}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              setInputValue(value);
              showMobileModal("", null);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (inputValue.trim() !== value.trim()) {
                await onSave(inputValue.trim());
              }
            }}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
  };

  return (
    <div className="group">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                handleMobileEdit();
              } else {
                onEditToggle();
              }
            }}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <Image src={editIcon} alt="edit" width={16} height={16} />
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-2">
          {renderInput(inputValue, setInputValue)}
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
                "Save"
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
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-slate-900 flex-1">
            {value || (
              <span className="text-slate-500 italic">{placeholder}</span>
            )}
          </p>
          {!label && (
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  handleMobileEdit();
                } else {
                  onEditToggle();
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
            >
              <Image src={editIcon} alt="edit" width={16} height={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
