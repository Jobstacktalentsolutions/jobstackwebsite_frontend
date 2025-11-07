import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  emptyMessage?: string;
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option...",
  required = false,
  disabled = false,
  className,
  icon,
  emptyMessage = "No options found.",
}: SearchableSelectProps) => {
  const [query, setQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Combobox
        value={value}
        onChange={(newValue) => {
          const selectedValue = newValue || "";
          onChange(selectedValue);
        }}
        onClose={() => setQuery("")}
        disabled={disabled}
      >
        <div className="relative w-full">
          <div className="flex items-center w-full">
            {icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                {icon}
              </div>
            )}
            <ComboboxInput
              className={cn(
                "w-full py-3 pr-10 text-sm leading-5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-slate-700",
                icon ? "pl-10" : "pl-3",
                disabled && "bg-slate-100 cursor-not-allowed"
              )}
              displayValue={() => selectedOption?.label || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <ComboboxButton className="absolute right-0 inset-y-0 flex items-center pr-3">
              <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="absolute z-50 bg-white shadow-lg mt-1 py-1 border border-slate-300 rounded-lg focus:outline-none w-full max-h-60 overflow-auto text-sm">
            {filteredOptions.length === 0 ? (
              <div className="relative px-4 py-2 text-slate-500 cursor-default select-none">
                {query !== "" ? emptyMessage : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option.value}
                  className={({ focus }) =>
                    cn(
                      "relative cursor-pointer select-none py-2 pl-10 pr-4",
                      focus
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )
                  }
                >
                  {({ selected, focus }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-medium" : "font-normal"
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            focus ? "text-white" : "text-blue-600"
                          )}
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};
