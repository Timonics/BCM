"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Music,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  UserCheck,
  Clock,
  Flag,
} from "lucide-react";

interface AssignBandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (data: BandAssignment) => void;
  memberData?: {
    id: string;
    name: string;
    gender: "Male" | "Female";
    age: number;
    dateOfBirth: string;
    currentBand?: string;
  };
}

interface BandAssignment {
  band: string;
  role: string;
  startDate: string;
  endDate: string | null;
}

interface Band {
  id: string;
  name: string;
  genderRestriction: "Male" | "Female" | "Mixed";
  minAge: number;
  maxAge: number;
  description: string;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export default function AssignBandModal({
  isOpen,
  onClose,
  onAssign,
  memberData = {
    id: "BCM1004",
    name: "James Wilson",
    gender: "Male",
    age: 28,
    dateOfBirth: "1997-03-15",
    currentBand: "Youth Band",
  },
}: AssignBandModalProps) {
  const [selectedBand, setSelectedBand] = useState("");
  const [role, setRole] = useState("Member");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("");
  const [hasEndDate, setHasEndDate] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    errors: [],
  });

  // Available bands with rules
  const bands: Band[] = [
    {
      id: "children",
      name: "Children's Band",
      genderRestriction: "Mixed",
      minAge: 5,
      maxAge: 12,
      description: "For children aged 5-12 years",
    },
    {
      id: "youth",
      name: "Youth Band",
      genderRestriction: "Mixed",
      minAge: 13,
      maxAge: 25,
      description: "For youth aged 13-25 years",
    },
    {
      id: "choir",
      name: "Choir Band",
      genderRestriction: "Mixed",
      minAge: 18,
      maxAge: 100,
      description: "For adult members with singing ministry",
    },
    {
      id: "men",
      name: "Men's Band",
      genderRestriction: "Male",
      minAge: 26,
      maxAge: 100,
      description: "For male members aged 26 and above",
    },
    {
      id: "women",
      name: "Women's Band",
      genderRestriction: "Female",
      minAge: 26,
      maxAge: 100,
      description: "For female members aged 26 and above",
    },
    {
      id: "overgrown",
      name: "Overgrown Band",
      genderRestriction: "Mixed",
      minAge: 26,
      maxAge: 100,
      description: "For members who have outgrown their previous band",
    },
  ];

  // Available roles
  const roles = [
    { value: "Member", label: "Member" },
    { value: "Assistant Coordinator", label: "Assistant Coordinator" },
    { value: "Coordinator", label: "Coordinator" },
    { value: "Secretary", label: "Secretary" },
    { value: "Treasurer", label: "Treasurer" },
    { value: "Welfare Officer", label: "Welfare Officer" },
  ];

  // Validate band assignment
  useEffect(() => {
    if (!selectedBand) {
      setValidation({
        isValid: true,
        warnings: [],
        errors: [],
      });
      return;
    }

    const band = bands.find((b) => b.id === selectedBand);
    if (!band) return;

    const warnings: string[] = [];
    const errors: string[] = [];

    // Gender validation
    if (
      band.genderRestriction !== "Mixed" &&
      band.genderRestriction !== memberData.gender
    ) {
      errors.push(
        `${band.name} is restricted to ${band.genderRestriction.toLowerCase()} members only. ${memberData.name} is ${memberData.gender.toLowerCase()}.`,
      );
    }

    // Age validation
    const memberAge = memberData.age;

    // Check if under minimum age
    if (memberAge < band.minAge) {
      errors.push(
        `${memberData.name} is too young for ${band.name}. Minimum age is ${band.minAge} years, current age is ${memberAge} years.`,
      );
    }

    // Check if over maximum age (warning)
    if (memberAge > band.maxAge && band.maxAge !== 100) {
      warnings.push(
        `⚠️ OVERGROWN: ${memberData.name} (${memberAge} years) exceeds the maximum age for ${band.name} (${band.maxAge} years). Consider assigning to Overgrown Band or a suitable adult band.`,
      );
    }

    // Age bracket warnings (approaching max age)
    if (
      memberAge >= band.maxAge - 2 &&
      memberAge <= band.maxAge &&
      band.maxAge !== 100
    ) {
      warnings.push(
        `${memberData.name} is approaching the maximum age for ${band.name}. They will need to transition to another band soon.`,
      );
    }

    // Check if already in the same band
    if (memberData.currentBand === band.name) {
      warnings.push(
        `${memberData.name} is already assigned to ${band.name}. This action will update their band record.`,
      );
    }

    // Validate dates
    if (hasEndDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        errors.push("End date must be after start date.");
      }
    }

    setValidation({
      isValid: errors.length === 0,
      warnings,
      errors,
    });
  }, [
    selectedBand,
    startDate,
    endDate,
    hasEndDate,
    memberData.age,
    memberData.gender,
    memberData.name,
    memberData.currentBand,
  ]);

  const handleAssign = () => {
    if (!validation.isValid || !selectedBand) return;

    const assignment: BandAssignment = {
      band: selectedBand,
      role,
      startDate,
      endDate: hasEndDate ? endDate : null,
    };

    onAssign?.(assignment);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setSelectedBand("");
    setRole("Member");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setHasEndDate(false);
    setValidation({
      isValid: true,
      warnings: [],
      errors: [],
    });
    onClose();
  };

  const getSelectedBand = () => bands.find((b) => b.id === selectedBand);

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
                Assign Band
              </h2>
              <p className="text-sm text-[#8F9BB3] mt-0.5">
                Assign member to a band with role and dates
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Member Information */}
          <Card className="border-[#EDF1F7] bg-[#F7F9FC]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#009AF4] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {memberData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#222B45]">
                      {memberData.name}
                    </p>
                    <p className="text-sm text-[#8F9BB3]">{memberData.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {memberData.gender}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {memberData.age} years
                    </Badge>
                  </div>
                  {memberData.currentBand && (
                    <p className="text-xs text-[#8F9BB3]">
                      Current:{" "}
                      <span className="font-medium text-[#222B45]">
                        {memberData.currentBand}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Select Band */}
            <div>
              <label className="block text-sm font-medium text-[#222B45] mb-2">
                Select Band <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBand}
                onChange={(e) => setSelectedBand(e.target.value)}
                className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              >
                <option value="">-- Choose a band --</option>
                {bands.map((band) => (
                  <option key={band.id} value={band.id}>
                    {band.name} ({band.description})
                  </option>
                ))}
              </select>

              {/* Band Details */}
              {selectedBand && getSelectedBand() && (
                <Card className="mt-3 border-[#EDF1F7]">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-[#8F9BB3] mb-1">Gender</p>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#009AF4]" />
                          <span className="font-medium text-[#222B45]">
                            {getSelectedBand()!.genderRestriction}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#8F9BB3] mb-1">Age Range</p>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#009AF4]" />
                          <span className="font-medium text-[#222B45]">
                            {getSelectedBand()!.minAge}-
                            {getSelectedBand()!.maxAge === 100
                              ? "∞"
                              : getSelectedBand()!.maxAge}{" "}
                            years
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#8F9BB3] mb-1">
                          Member Age
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Flag className="w-4 h-4 text-[#009AF4]" />
                          <span className="font-medium text-[#222B45]">
                            {memberData.age} years
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Role in Band */}
            <div>
              <label className="block text-sm font-medium text-[#222B45] mb-2">
                Role in Band <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#8F9BB3] mt-2">
                Select the member's role or position within the band
              </p>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  End Date <span className="text-[#8F9BB3]">(Optional)</span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="has-end-date"
                      checked={hasEndDate}
                      onChange={(e) => {
                        setHasEndDate(e.target.checked);
                        if (!e.target.checked) setEndDate("");
                      }}
                      className="w-4 h-4 text-[#009AF4] border-[#EDF1F7] rounded focus:ring-2 focus:ring-[#009AF4]"
                    />
                    <label
                      htmlFor="has-end-date"
                      className="text-sm text-[#222B45]"
                    >
                      Set end date
                    </label>
                  </div>
                  {hasEndDate && (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full pl-10 pr-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Validation Messages */}
          {selectedBand && (
            <div className="space-y-3">
              {/* Errors */}
              {validation.errors.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-900 mb-2">
                          Validation Errors
                        </p>
                        <ul className="space-y-1">
                          {validation.errors.map((error, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-red-800 flex items-start gap-2"
                            >
                              <span className="text-red-600 mt-1">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {validation.warnings.length > 0 &&
                validation.errors.length === 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-orange-900 mb-2">
                            Warnings
                          </p>
                          <ul className="space-y-1">
                            {validation.warnings.map((warning, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-orange-800 flex items-start gap-2"
                              >
                                <span className="text-orange-600 mt-1">•</span>
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                          {validation.warnings.some((w) =>
                            w.includes("OVERGROWN"),
                          ) && (
                            <div className="mt-3 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                              <p className="text-xs font-medium text-orange-900">
                                Recommended Action:
                              </p>
                              <p className="text-xs text-orange-800 mt-1">
                                Consider assigning to "Overgrown Band" or
                                transitioning to an age-appropriate adult band
                                (Men's Band, Women's Band, or Choir Band).
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Success */}
              {validation.isValid && validation.warnings.length === 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">
                          All validations passed
                        </p>
                        <p className="text-sm text-green-800 mt-1">
                          {memberData.name} meets all requirements for{" "}
                          {getSelectedBand()?.name}.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Information Box */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Band Assignment Rules</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>
                      Members must meet gender requirements for gender-specific
                      bands
                    </li>
                    <li>
                      Members must be within the age bracket for their assigned
                      band
                    </li>
                    <li>
                      Overgrown members will receive a warning but can still be
                      assigned
                    </li>
                    <li>
                      Previous band assignments will be automatically ended when
                      a new band is assigned
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
              onClick={handleAssign}
              disabled={!validation.isValid || !selectedBand}
              className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {validation.warnings.length > 0
                ? "Assign with Warnings"
                : "Assign to Band"}
            </Button>
          </div>
          {!validation.isValid && selectedBand && (
            <p className="text-xs text-red-600 text-center mt-3">
              Please resolve validation errors before assigning
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
