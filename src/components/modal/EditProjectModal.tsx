import { useState, useEffect } from "react";
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
  Archive,
  Save,
  Globe,
  Music,
  Building2,
  Heart,
  GraduationCap,
  Target,
  AlertCircle,
  Info,
} from "lucide-react";

interface Project {
  id: string;
  projectName: string;
  projectType:
    | "Evangelism"
    | "Worship"
    | "Education"
    | "Infrastructure"
    | "Welfare"
    | "Youth"
    | "General"
    | "Program"
    | "Event"
    | "Construction"
    | "Outreach";
  year: number;
  committeeSize: number;
  status: "Active" | "Completed" | "Planned";
  startDate: string;
  endDate?: string;
  description?: string;
  progress?: number;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  project: Project | null;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  project,
}: EditProjectModalProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "Program" as
      | "Program"
      | "Event"
      | "Construction"
      | "Outreach"
      | "General"
      | "Evangelism"
      | "Worship"
      | "Education"
      | "Infrastructure"
      | "Welfare"
      | "Youth",
    year: currentYear,
    description: "",
    startDate: "",
    endDate: "",
    status: "Active" as "Active" | "Planned" | "Completed",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showCompletedToast, setShowCompletedToast] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showArchivedToast, setShowArchivedToast] = useState(false);

  // Pre-fill form when project changes
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        projectName: project.projectName,
        projectType: project.projectType,
        year: project.year,
        description: project.description || "",
        startDate: project.startDate,
        endDate: project.endDate || "",
        status: project.status,
      });
      setErrors({});
      setShowSuccessToast(false);
      setShowCompletedToast(false);
      setShowArchiveConfirm(false);
      setShowArchivedToast(false);
    }
  }, [isOpen, project]);

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
    if (!validateForm() || !project) {
      return;
    }

    // Update project with new data
    const updatedProject: Project = {
      ...project,
      projectName: formData.projectName,
      projectType: formData.projectType,
      year: formData.year,
      description: formData.description || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      status: formData.status,
    };

    // Save the project
    onSave(updatedProject);

    // Show success and close
    setShowSuccessToast(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleMarkAsCompleted = () => {
    if (!project) return;

    const completedProject: Project = {
      ...project,
      projectName: formData.projectName,
      projectType: formData.projectType,
      year: formData.year,
      description: formData.description || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      status: "Completed",
      progress: 100,
    };

    onSave(completedProject);
    setShowCompletedToast(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleArchiveProject = () => {
    if (!project || !onDelete) return;

    // Delete/archive the project
    onDelete(project.id);
    setShowArchiveConfirm(false);
    setShowArchivedToast(true);
    setTimeout(() => {
      onClose();
    }, 1500);
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
      case "Evangelism":
        return <Globe className="w-4 h-4" />;
      case "Worship":
        return <Music className="w-4 h-4" />;
      case "Education":
        return <GraduationCap className="w-4 h-4" />;
      case "Infrastructure":
        return <Building2 className="w-4 h-4" />;
      case "Welfare":
        return <Heart className="w-4 h-4" />;
      case "Youth":
        return <Users className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  if (!isOpen || !project) return null;

  const hasCommitteeMembers = project.committeeSize > 0;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={!showArchiveConfirm ? onClose : undefined}
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
                  Edit Project
                </h2>
                <p className="text-sm text-[#8F9BB3] mt-0.5">
                  Update project details and settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F9FC] rounded-lg transition-colors"
              disabled={showArchiveConfirm}
            >
              <X className="w-5 h-5 text-[#8F9BB3]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              {/* Committee Members Warning */}
              {hasCommitteeMembers && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 mb-1">
                      Active Committee Members
                    </p>
                    <p className="text-xs text-amber-700">
                      This project has{" "}
                      <span className="font-semibold">
                        {project.committeeSize} active committee members
                      </span>
                      . Archiving this project will remove all committee
                      assignments.
                    </p>
                  </div>
                </div>
              )}

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
                  {[
                    currentYear - 2,
                    currentYear - 1,
                    currentYear,
                    currentYear + 1,
                    currentYear + 2,
                  ].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
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
                <div className="grid grid-cols-3 gap-3">
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
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <div className="text-center">
                        <p className="font-medium text-sm">Active</p>
                        <p className="text-xs opacity-75">Currently running</p>
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
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <div className="text-center">
                        <p className="font-medium text-sm">Planned</p>
                        <p className="text-xs opacity-75">Scheduled future</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, status: "Completed" })
                    }
                    className={`p-4 border rounded-lg transition-all ${
                      formData.status === "Completed"
                        ? "border-gray-500 bg-gray-50 text-gray-700"
                        : "border-[#EDF1F7] hover:border-gray-500/50 text-[#8F9BB3]"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Archive className="w-5 h-5" />
                      <div className="text-center">
                        <p className="font-medium text-sm">Completed</p>
                        <p className="text-xs opacity-75">Finished</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              {project.status !== "Completed" && (
                <div className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-[#009AF4]" />
                    <p className="text-sm font-medium text-[#222B45]">
                      Quick Actions
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAsCompleted}
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-[#EDF1F7] bg-[#F7F9FC]">
            <div>
              <Button
                variant="outline"
                onClick={() => setShowArchiveConfirm(true)}
                disabled={showArchiveConfirm}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive Project
              </Button>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={showArchiveConfirm}
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={showArchiveConfirm}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          isVisible
          message="Project updated successfully!"
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* Completed Toast */}
      {showCompletedToast && (
        <Toast
          isVisible
          message="Project marked as completed!"
          type="success"
          onClose={() => setShowCompletedToast(false)}
        />
      )}

      {/* Archived Toast */}
      {showArchivedToast && (
        <Toast
          isVisible
          message="Project archived successfully!"
          type="success"
          onClose={() => setShowArchivedToast(false)}
        />
      )}

      {/* Archive Confirmation Dialog */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#222B45] mb-2">
                Archive Project?
              </h3>
              <p className="text-sm text-[#8F9BB3] mb-4">
                You are about to archive{" "}
                <span className="font-medium text-[#222B45]">
                  {project.projectName}
                </span>
                .
              </p>

              {/* Warning Box */}
              {hasCommitteeMembers ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-left mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900 mb-2">
                        Warning: Active Committee Members
                      </p>
                      <p className="text-xs text-red-700 mb-3">
                        This project has{" "}
                        <span className="font-bold">
                          {project.committeeSize} active committee members
                        </span>
                        . Archiving will:
                      </p>
                      <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                        <li>Remove all committee member assignments</li>
                        <li>Delete project tracking data</li>
                        <li>Move project to archived status</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-700">
                        Archived projects can be restored later from the
                        archived projects view.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-[#222B45] font-medium">
                This action cannot be undone. Continue?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                onClick={() => setShowArchiveConfirm(false)}
                variant="outline"
                className="flex-1 border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleArchiveProject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Archive className="w-4 h-4 mr-2" />
                {hasCommitteeMembers ? "Archive Anyway" : "Archive Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
