import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Toast from "../Toast";
import {
  X,
  Briefcase,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  ArrowRight,
  Globe,
  Music,
  Building2,
  Heart,
  GraduationCap,
  Target,
} from "lucide-react";

interface Project {
  id: string;
  projectName: string;
  projectType: "Program" | "Event" | "Construction" | "Outreach" | "General";
  year: number;
  committeeSize: number;
  status: "Active" | "Planned";
  startDate: string;
  endDate?: string;
  description?: string;
  progress?: number;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSave,
}: CreateProjectModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "Program" as
      | "Program"
      | "Event"
      | "Construction"
      | "Outreach"
      | "General",
    year: currentYear,
    description: "",
    startDate: "",
    endDate: "",
    status: "Active" as "Active" | "Planned",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showRedirectPrompt, setShowRedirectPrompt] = useState(false);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        projectName: "",
        projectType: "Program",
        year: currentYear,
        description: "",
        startDate: "",
        endDate: "",
        status: "Active",
      });
      setErrors({});
      setShowSuccessToast(false);
      setShowRedirectPrompt(false);
      setCreatedProject(null);
    }
  }, [isOpen, currentYear]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (formData.endDate && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Generate unique ID
    const newProject: Project = {
      id: `p${Date.now()}`,
      projectName: formData.projectName,
      projectType: formData.projectType,
      year: formData.year,
      committeeSize: 0,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      description: formData.description || undefined,
      progress: formData.status === "Active" ? 0 : undefined,
    };

    // Save the project
    onSave(newProject);
    setCreatedProject(newProject);

    // Show success and redirect prompt
    setShowSuccessToast(true);
    setShowRedirectPrompt(true);
  };

  const handleRedirectToAssign = () => {
    // Close modal and redirect to assign members
    setShowRedirectPrompt(false);
    onClose();
    // TODO: Navigate to assign committee members page
    alert(
      `Redirecting to assign committee members for: ${createdProject?.projectName}`
    );
  };

  const handleStayOnList = () => {
    // Just close everything
    setShowRedirectPrompt(false);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Program":
        return <Target className="w-4 h-4" />;
      case "Event":
        return <Calendar className="w-4 h-4" />;
      case "Construction":
        return <Building2 className="w-4 h-4" />;
      case "Outreach":
        return <Heart className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={!showRedirectPrompt ? onClose : undefined}
        />

        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#009AF4]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#222B45]">
                  Create New Project
                </h2>
                <p className="text-sm text-[#8F9BB3] mt-0.5">
                  Define a new committee project
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F9FC] rounded-lg transition-colors"
              disabled={showRedirectPrompt}
            >
              <X className="w-5 h-5 text-[#8F9BB3]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => {
                    setFormData({ ...formData, projectName: e.target.value });
                    if (errors.projectName) {
                      setErrors({ ...errors, projectName: "" });
                    }
                  }}
                  placeholder="Enter project name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                    errors.projectName
                      ? "border-red-300 bg-red-50"
                      : "border-[#EDF1F7]"
                  }`}
                />
                {errors.projectName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.projectName}
                  </p>
                )}
              </div>

              {/* Project Category */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Project Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(
                    [
                      "Program",
                      "Event",
                      "Construction",
                      "Outreach",
                      "General",
                    ] as const
                  ).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, projectType: category })
                      }
                      className={`p-3 border rounded-lg transition-all ${
                        formData.projectType === category
                          ? "border-[#009AF4] bg-[#009AF4]/10 text-[#009AF4]"
                          : "border-[#EDF1F7] hover:border-[#009AF4]/50 text-[#8F9BB3]"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="text-xs font-medium">{category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Year */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Project Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                >
                  {[currentYear, currentYear + 1, currentYear + 2].map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide a brief description of the project"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm resize-none"
                />
                <p className="mt-1 text-xs text-[#8F9BB3]">
                  Optional: Describe the project goals and objectives
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Project Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData({ ...formData, startDate: e.target.value });
                        if (errors.startDate) {
                          setErrors({ ...errors, startDate: "" });
                        }
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                        errors.startDate
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDF1F7]"
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Project End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData({ ...formData, endDate: e.target.value });
                        if (errors.endDate) {
                          setErrors({ ...errors, endDate: "" });
                        }
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                        errors.endDate
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDF1F7]"
                      }`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: "Active" })
                    }
                    className={`p-4 border rounded-lg transition-all ${
                      formData.status === "Active"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-[#EDF1F7] hover:border-green-500/50 text-[#8F9BB3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium text-sm">Active</p>
                        <p className="text-xs opacity-75">
                          Project is currently running
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: "Planned" })
                    }
                    className={`p-4 border rounded-lg transition-all ${
                      formData.status === "Planned"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-[#EDF1F7] hover:border-blue-500/50 text-[#8F9BB3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium text-sm">Planned</p>
                        <p className="text-xs opacity-75">
                          Project scheduled for future
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Next Step
                  </p>
                  <p className="text-xs text-blue-700">
                    After creating the project, you'll have the option to assign
                    committee members to manage and execute this project.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-[#EDF1F7] bg-[#F7F9FC]">
            <p className="text-xs text-[#8F9BB3]">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={showRedirectPrompt}
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={showRedirectPrompt}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          isVisible
          message="Project created successfully!"
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* Redirect Prompt Modal */}
      {showRedirectPrompt && createdProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#222B45] mb-2">
                Project Created Successfully!
              </h3>
              <p className="text-sm text-[#8F9BB3] mb-4">
                <span className="font-medium text-[#222B45]">
                  {createdProject.projectName}
                </span>{" "}
                has been added to your project list.
              </p>

              {/* Project Summary Card */}
              <div className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg text-left mb-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[#8F9BB3] mb-1">Category</p>
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(createdProject.projectType)}
                      <span className="font-medium text-[#222B45]">
                        {createdProject.projectType}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#8F9BB3] mb-1">Year</p>
                    <p className="font-medium text-[#222B45]">
                      {createdProject.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#8F9BB3] mb-1">Status</p>
                    <Badge
                      variant="outline"
                      className={
                        createdProject.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }
                    >
                      {createdProject.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[#8F9BB3] mb-1">Committee</p>
                    <p className="font-medium text-[#222B45]">Not assigned</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#222B45] font-medium mb-2">
                Would you like to assign committee members now?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRedirectToAssign}
                className="w-full bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Assign Committee Members
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleStayOnList}
                variant="outline"
                className="w-full border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                Stay on Project List
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
