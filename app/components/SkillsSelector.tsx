"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Plus } from "lucide-react";
import { getSkills, suggestSkill, type Skill } from "@/app/api/skills.api";
import { toastSuccess, toastError } from "@/app/lib/toast";
import Button from "./button";

export interface SelectedSkill {
  id: string;
  name: string;
  proficiency?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsExperience?: number;
}

interface SkillsSelectorProps {
  selectedSkills: SelectedSkill[];
  onSkillsChange: (skills: SelectedSkill[]) => void;
  maxSkills?: number;
  showProficiency?: boolean;
  showExperience?: boolean;
}

const SkillsSelector: React.FC<SkillsSelectorProps> = ({
  selectedSkills,
  onSkillsChange,
  maxSkills = 20,
  showProficiency = true,
  showExperience = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [suggestSkillName, setSuggestSkillName] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = availableSkills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedSkills.some((selected) => selected.id === skill.id)
      );
      setFilteredSkills(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSkills([]);
      setShowDropdown(false);
    }
  }, [searchQuery, availableSkills, selectedSkills]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowSuggestForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const skills = await getSkills();
      setAvailableSkills(skills);
    } catch (err) {
      toastError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const searchSkills = async (query: string) => {
    if (!query.trim()) return;

    try {
      const skills = await getSkills(query);
      setAvailableSkills((prev) => {
        const existing = new Set(prev.map((s) => s.id));
        const newSkills = skills.filter((s) => !existing.has(s.id));
        return [...prev, ...newSkills];
      });
    } catch (err) {
      console.error("Failed to search skills:", err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounced search
    if (query.length > 2) {
      const timeoutId = setTimeout(() => searchSkills(query), 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const addSkill = (skill: Skill) => {
    if (selectedSkills.length >= maxSkills) {
      toastError(`Maximum ${maxSkills} skills allowed`);
      return;
    }

    const newSkill: SelectedSkill = {
      id: skill.id,
      name: skill.name,
      proficiency: "INTERMEDIATE",
      yearsExperience: 1,
    };

    onSkillsChange([...selectedSkills, newSkill]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(selectedSkills.filter((skill) => skill.id !== skillId));
  };

  const updateSkill = (skillId: string, updates: Partial<SelectedSkill>) => {
    onSkillsChange(
      selectedSkills.map((skill) =>
        skill.id === skillId ? { ...skill, ...updates } : skill
      )
    );
  };

  const handleSuggestSkill = async () => {
    if (!suggestSkillName.trim()) return;

    try {
      setSuggesting(true);
      const newSkill = await suggestSkill({ name: suggestSkillName.trim() });

      // Add the suggested skill to available skills and select it
      setAvailableSkills((prev) => [...prev, newSkill]);
      addSkill(newSkill);

      setSuggestSkillName("");
      setShowSuggestForm(false);
      toastSuccess("Skill suggested and added to your profile");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to suggest skill";
      toastError(errorMessage);
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Skills ({selectedSkills.length}/{maxSkills})
        </label>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search for skills..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                Loading skills...
              </div>
            ) : filteredSkills.length > 0 ? (
              <>
                {filteredSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="font-medium">{skill.name}</div>
                    {skill.description && (
                      <div className="text-sm text-gray-500">
                        {skill.description}
                      </div>
                    )}
                  </button>
                ))}
                <div className="border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestForm(true);
                      setSuggestSkillName(searchQuery);
                    }}
                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Suggest "{searchQuery}" as a new skill
                  </button>
                </div>
              </>
            ) : searchQuery.length > 0 ? (
              <div className="p-3">
                <div className="text-gray-500 text-center mb-2">
                  No skills found
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuggestForm(true);
                    setSuggestSkillName(searchQuery);
                  }}
                  className="w-full text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-center gap-2 py-2 rounded"
                >
                  <Plus size={16} />
                  Suggest "{searchQuery}" as a new skill
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Suggest Skill Form */}
        {showSuggestForm && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <h4 className="font-medium mb-2">Suggest a new skill</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Skill name"
                value={suggestSkillName}
                onChange={(e) => setSuggestSkillName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <Button
                type="button"
                onClick={handleSuggestSkill}
                disabled={suggesting || !suggestSkillName.trim()}
                className="px-4 py-2"
              >
                {suggesting ? "Adding..." : "Add"}
              </Button>
              <button
                type="button"
                onClick={() => setShowSuggestForm(false)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">Selected Skills</h4>
          <div className="space-y-2">
            {selectedSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{skill.name}</div>
                </div>

                {showProficiency && (
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      updateSkill(skill.id, {
                        proficiency: e.target.value as any,
                      })
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                )}

                {showExperience && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={skill.yearsExperience}
                      onChange={(e) =>
                        updateSkill(skill.id, {
                          yearsExperience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <span className="text-sm text-gray-500">yrs</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSelector;
