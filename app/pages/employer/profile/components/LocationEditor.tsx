import React, { useState } from "react";
import Image from "next/image";
import editIcon from "@/app/assets/editIcon.svg";

interface LocationEditorProps {
  state?: string;
  city?: string;
  onSave: (state: string, city: string) => Promise<void>;
  renderInput: (
    state: string,
    city: string,
    onStateChange: (state: string) => void,
    onCityChange: (city: string) => void
  ) => React.ReactNode;
  isEditing: boolean;
  onEditToggle: () => void;
  showMobileModal: (title: string, content: React.ReactNode) => void;
  closeMobileModal: () => void;
  isSaving?: boolean;
}

export const LocationEditor: React.FC<LocationEditorProps> = ({
  state = "",
  city = "",
  onSave,
  renderInput,
  isEditing,
  onEditToggle,
  showMobileModal,
  closeMobileModal,
  isSaving = false,
}) => {
  const [inputState, setInputState] = useState(state);
  const [inputCity, setInputCity] = useState(city);

  const handleSave = async () => {
    if (
      inputState.trim() !== state.trim() ||
      inputCity.trim() !== city.trim()
    ) {
      await onSave(inputState.trim(), inputCity.trim());
    }
    onEditToggle();
  };

  const handleCancel = () => {
    setInputState(state);
    setInputCity(city);
    onEditToggle();
  };

  const handleMobileEdit = () => {
    setInputState(state);
    setInputCity(city);
    const modalContent = (
      <div className="space-y-4">
        {renderInput(inputState, inputCity, setInputState, setInputCity)}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              setInputState(state);
              setInputCity(city);
              closeMobileModal();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (
                inputState.trim() !== state.trim() ||
                inputCity.trim() !== city.trim()
              ) {
                await onSave(inputState.trim(), inputCity.trim());
              } else {
                closeMobileModal();
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
    showMobileModal("Edit Location", modalContent);
  };

  const displayValue = () => {
    if (city && state) {
      return `${city}, ${state}`;
    }
    if (city) {
      return city;
    }
    if (state) {
      return state;
    }
    return "Not specified";
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Location
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
          <Image src={editIcon} alt="edit location" width={16} height={16} />
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {renderInput(inputState, inputCity, setInputState, setInputCity)}
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
        <p className="text-slate-900">{displayValue()}</p>
      )}
    </div>
  );
};
