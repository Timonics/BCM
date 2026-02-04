"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Music, CheckCircle, Info, AlertCircle } from "lucide-react";

interface AddNewBandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (bandData: BandFormData) => void;
}

interface BandFormData {
  name: string;
  code: string;
  type: "Male" | "Female" | "Mixed";
  hasAgeBracket: boolean;
  minAge: number;
  maxAge: number;
  description: string;
  isActive: boolean;
}

export default function AddNewBandModal({
  isOpen,
  onClose,
  onSave,
}: AddNewBandModalProps) {
  const [formData, setFormData] = useState<BandFormData>({
    name: "",
    code: "",
    type: "Mixed",
    hasAgeBracket: true,
    minAge: 0,
    maxAge: 100,
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: any) => {
    switch (name) {
      case "name":
        if (!value || value.trim() === "") {
          return "Band name is required";
        }
        if (value.length < 3) {
          return "Band name must be at least 3 characters";
        }
        return "";
      case "minAge":
        if (formData.hasAgeBracket) {
          const num = Number(value);
          if (isNaN(num) || num < 0) {
            return "Minimum age must be a positive number";
          }
          if (num >= formData.maxAge) {
            return "Minimum age must be less than maximum age";
          }
        }
        return "";
      case "maxAge":
        if (formData.hasAgeBracket) {
          const num = Number(value);
          if (isNaN(num) || num <= 0) {
            return "Maximum age must be greater than 0";
          }
          if (num <= formData.minAge) {
            return "Maximum age must be greater than minimum age";
          }
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // Also re-validate related fields
    if (name === "minAge" || name === "maxAge") {
      const relatedField = name === "minAge" ? "maxAge" : "minAge";
      const relatedError = validateField(relatedField, formData[relatedField]);
      setErrors((prev) => ({ ...prev, [relatedField]: relatedError }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isFormValid = () => {
    // Check required fields
    if (!formData.name || formData.name.trim() === "") return false;
    if (formData.name.length < 3) return false;

    // Check age bracket validation if enabled
    if (formData.hasAgeBracket) {
      if (formData.minAge < 0 || formData.maxAge <= 0) return false;
      if (formData.minAge >= formData.maxAge) return false;
    }

    // Check if there are any errors
    return Object.values(errors).every((error) => error === "");
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      code: true,
      minAge: true,
      maxAge: true,
    });

    if (isFormValid()) {
      onSave?.(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      code: "",
      type: "Mixed",
      hasAgeBracket: true,
      minAge: 0,
      maxAge: 100,
      description: "",
      isActive: true,
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
              <Music className="w-5 h-5 text-[#009AF4]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">
                Add New Band
              </h2>
              <p className="text-sm text-[#8F9BB3] mt-0.5">
                Create a new band with membership rules
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#EDF1F7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8F9BB3]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  1
                </div>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Band Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Band Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="e.g., Youth Band, Children's Band"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                      touched.name && errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-[#EDF1F7]"
                    }`}
                  />
                  {touched.name && errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Band Code */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Band Code or Short Name{" "}
                    <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    placeholder="e.g., YTH, CHD, CHR"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-[#8F9BB3] mt-1">
                    Short code for quick identification
                  </p>
                </div>
              </div>
            </div>

            {/* Band Type Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  2
                </div>
                Band Type
              </h3>

              <div className="space-y-3">
                {/* Male Band */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50">
                  <input
                    type="radio"
                    name="bandType"
                    value="Male"
                    checked={formData.type === "Male"}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] focus:ring-[#009AF4] focus:ring-2"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-[#222B45]">
                      Male Band
                    </span>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      Only male members can join this band
                    </p>
                  </div>
                  {formData.type === "Male" && (
                    <CheckCircle className="w-5 h-5 text-[#009AF4]" />
                  )}
                </label>

                {/* Female Band */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50">
                  <input
                    type="radio"
                    name="bandType"
                    value="Female"
                    checked={formData.type === "Female"}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] focus:ring-[#009AF4] focus:ring-2"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-[#222B45]">
                      Female Band
                    </span>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      Only female members can join this band
                    </p>
                  </div>
                  {formData.type === "Female" && (
                    <CheckCircle className="w-5 h-5 text-[#009AF4]" />
                  )}
                </label>

                {/* Mixed Band */}
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50">
                  <input
                    type="radio"
                    name="bandType"
                    value="Mixed"
                    checked={formData.type === "Mixed"}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] focus:ring-[#009AF4] focus:ring-2"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-[#222B45]">
                      Mixed Band
                    </span>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      Open to all genders
                    </p>
                  </div>
                  {formData.type === "Mixed" && (
                    <CheckCircle className="w-5 h-5 text-[#009AF4]" />
                  )}
                </label>
              </div>
            </div>

            {/* Age Bracket Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  3
                </div>
                Age Bracket
              </h3>

              {/* Age Bracket Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg mb-4">
                <div className="flex-1">
                  <p className="font-medium text-[#222B45] text-sm">
                    Enable Age Restrictions
                  </p>
                  <p className="text-xs text-[#8F9BB3] mt-0.5">
                    Set minimum and maximum age limits for this band
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange("hasAgeBracket", !formData.hasAgeBracket)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.hasAgeBracket ? "bg-[#009AF4]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.hasAgeBracket ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Age Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Minimum Age */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      formData.hasAgeBracket
                        ? "text-[#222B45]"
                        : "text-[#8F9BB3]"
                    }`}
                  >
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    value={formData.minAge}
                    onChange={(e) =>
                      handleInputChange("minAge", Number(e.target.value))
                    }
                    onBlur={() => handleBlur("minAge")}
                    disabled={!formData.hasAgeBracket}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      formData.hasAgeBracket
                        ? touched.minAge && errors.minAge
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDF1F7] focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                  {formData.hasAgeBracket &&
                    touched.minAge &&
                    errors.minAge && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.minAge}</span>
                      </div>
                    )}
                </div>

                {/* Maximum Age */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      formData.hasAgeBracket
                        ? "text-[#222B45]"
                        : "text-[#8F9BB3]"
                    }`}
                  >
                    Maximum Age
                  </label>
                  <input
                    type="number"
                    value={formData.maxAge}
                    onChange={(e) =>
                      handleInputChange("maxAge", Number(e.target.value))
                    }
                    onBlur={() => handleBlur("maxAge")}
                    disabled={!formData.hasAgeBracket}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      formData.hasAgeBracket
                        ? touched.maxAge && errors.maxAge
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDF1F7] focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                        : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                  {formData.hasAgeBracket &&
                    touched.maxAge &&
                    errors.maxAge && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.maxAge}</span>
                      </div>
                    )}
                </div>
              </div>

              {/* Helper Text */}
              <Card className="border-blue-200 bg-blue-50 mt-4">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900">
                      <p className="font-medium mb-1">Age Bracket Behavior</p>
                      <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                        <li>
                          Members outside the age range will be flagged as
                          "overgrown"
                        </li>
                        <li>
                          Use 0-100 for no age restrictions, or disable age
                          bracket
                        </li>
                        <li>
                          Age is automatically calculated from date of birth
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Details Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  4
                </div>
                Additional Details
              </h3>

              <div className="space-y-4">
                {/* Band Description */}
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Band Description{" "}
                    <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe the band's purpose, activities, and membership..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm resize-none"
                  />
                  <p className="text-xs text-[#8F9BB3] mt-1">
                    {formData.description.length} / 500 characters
                  </p>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-[#222B45] text-sm">
                      Band Status
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      {formData.isActive
                        ? "Band is active and accepting members"
                        : "Band is inactive and not accepting members"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        formData.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange("isActive", !formData.isActive)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EDF1F7] p-6 bg-white">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-[#EDF1F7] hover:border-[#222B45] hover:text-[#222B45]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid()}
              className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Music className="w-4 h-4 mr-2" />
              Create Band
            </Button>
          </div>
          {!isFormValid() && Object.keys(touched).length > 0 && (
            <p className="text-xs text-red-600 text-center mt-3">
              Please fill in all required fields correctly
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
