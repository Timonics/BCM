"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Grid3x3,
  CheckCircle,
  Info,
  AlertCircle,
  Archive,
  AlertTriangle,
} from "lucide-react";

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (unitData: UnitFormData) => void;
  onArchive?: (unitId: string) => void;
  unitData?: {
    id: string;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
    defaultLeadershipRoles: string[];
    membersCount?: number;
    activeMembers?: number;
  };
}

interface UnitFormData {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  defaultLeadershipRoles: string[];
}

export default function EditUnitModal({
  isOpen,
  onClose,
  onSave,
  onArchive,
  unitData,
}: EditUnitModalProps) {
  const [formData, setFormData] = useState<UnitFormData>({
    id: "",
    name: "",
    code: "",
    description: "",
    isActive: true,
    defaultLeadershipRoles: [],
  });

  const [originalData, setOriginalData] = useState<UnitFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const availableLeadershipRoles = [
    {
      id: "head",
      label: "Head of Unit",
      description: "Primary leader and coordinator",
    },
    {
      id: "assistant",
      label: "Assistant Head",
      description: "Supports the head and acts in their absence",
    },
    {
      id: "secretary",
      label: "Secretary",
      description: "Manages records and communications",
    },
  ];

  // Initialize form data when modal opens or unitData changes
  useEffect(() => {
    if (isOpen && unitData) {
      const initialData = {
        id: unitData.id,
        name: unitData.name,
        code: unitData.code || "",
        description: unitData.description || "",
        isActive: unitData.isActive,
        defaultLeadershipRoles: unitData.defaultLeadershipRoles || [],
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [isOpen, unitData]);

  const validateField = (name: string, value: any) => {
    switch (name) {
      case "name":
        if (!value || value.trim() === "") {
          return "Unit name is required";
        }
        if (value.length < 3) {
          return "Unit name must be at least 3 characters";
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
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const toggleLeadershipRole = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultLeadershipRoles: prev.defaultLeadershipRoles.includes(roleId)
        ? prev.defaultLeadershipRoles.filter((r) => r !== roleId)
        : [...prev.defaultLeadershipRoles, roleId],
    }));
  };

  const isFormValid = () => {
    // Check required fields
    if (!formData.name || formData.name.trim() === "") return false;
    if (formData.name.length < 3) return false;

    // Check if there are any errors
    return Object.values(errors).every((error) => error === "");
  };

  const hasChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      code: true,
    });

    if (isFormValid()) {
      onSave?.(formData);
      handleClose();
    }
  };

  const handleArchive = () => {
    setShowArchiveConfirm(true);
  };

  const confirmArchive = () => {
    onArchive?.(formData.id);
    setShowArchiveConfirm(false);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      id: "",
      name: "",
      code: "",
      description: "",
      isActive: true,
      defaultLeadershipRoles: [],
    });
    setOriginalData(null);
    setErrors({});
    setTouched({});
    setShowArchiveConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Grid3x3 className="w-5 h-5 text-[#009AF4]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#222B45]">
                  Edit Unit
                </h2>
                <p className="text-sm text-[#8F9BB3] mt-0.5">
                  Update unit details and leadership structure
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
                  {/* Unit Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Unit Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      onBlur={() => handleBlur("name")}
                      placeholder="e.g., Teaching Unit, Media Team, Welfare Unit"
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

                  {/* Unit Code */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Unit Code or Abbreviation{" "}
                      <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        handleInputChange("code", e.target.value)
                      }
                      placeholder="e.g., TCH, MED, WEL"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Short code for quick identification and reports
                    </p>
                  </div>

                  {/* Unit Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Unit Description{" "}
                      <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the unit's purpose, responsibilities, and activities..."
                      rows={4}
                      className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm resize-none"
                    />
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      {formData.description.length} / 500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Default Leadership Roles Section */}
              <div>
                <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                    2
                  </div>
                  Default Leadership Roles
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs ml-2"
                  >
                    Optional
                  </Badge>
                </h3>

                <Card className="border-blue-200 bg-blue-50 mb-4">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-900">
                        <p className="font-medium mb-1">
                          Leadership Roles Management
                        </p>
                        <p className="text-blue-800">
                          Update the default leadership positions for this unit.
                          Changes here do not affect currently assigned members.
                          You can manage active leadership assignments from the
                          Unit Leadership page.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {availableLeadershipRoles.map((role) => (
                    <label
                      key={role.id}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50 ${
                        formData.defaultLeadershipRoles.includes(role.id)
                          ? "border-[#009AF4] bg-[#009AF4]/5"
                          : "border-[#EDF1F7]"
                      }`}
                    >
                      <div className="flex items-center h-6">
                        <input
                          type="checkbox"
                          checked={formData.defaultLeadershipRoles.includes(
                            role.id,
                          )}
                          onChange={() => toggleLeadershipRole(role.id)}
                          className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] rounded focus:ring-[#009AF4] focus:ring-2"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#222B45]">
                            {role.label}
                          </span>
                          {formData.defaultLeadershipRoles.includes(
                            role.id,
                          ) && (
                            <CheckCircle className="w-4 h-4 text-[#009AF4]" />
                          )}
                        </div>
                        <p className="text-xs text-[#8F9BB3] mt-0.5">
                          {role.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.defaultLeadershipRoles.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-900 font-medium">
                          {formData.defaultLeadershipRoles.length} leadership
                          role
                          {formData.defaultLeadershipRoles.length > 1
                            ? "s"
                            : ""}{" "}
                          selected
                        </p>
                        <p className="text-xs text-green-800 mt-1">
                          These roles will be available for assignment when you
                          add members to this unit.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Unit Status Section */}
              <div>
                <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                    3
                  </div>
                  Unit Status
                </h3>

                <div className="flex items-center justify-between p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-[#222B45] text-sm">Status</p>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      {formData.isActive
                        ? "Unit is active and available for member assignment"
                        : "Unit is inactive and not available for member assignment"}
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
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-[#EDF1F7] p-6 bg-white">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Button
                variant="outline"
                onClick={handleArchive}
                className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive Unit
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="border-[#EDF1F7] hover:border-[#222B45] hover:text-[#222B45]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!isFormValid() || !hasChanges()}
                  className="bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
            {!isFormValid() && Object.keys(touched).length > 0 && (
              <p className="text-xs text-red-600 text-center">
                Please fill in all required fields correctly
              </p>
            )}
            {isFormValid() && !hasChanges() && (
              <p className="text-xs text-[#8F9BB3] text-center">
                No changes detected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <Archive className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#222B45]">
                    Archive Unit?
                  </h3>
                  <p className="text-sm text-[#8F9BB3] mt-0.5">
                    This action can be undone later
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-[#222B45]">
                  Archiving{" "}
                  <span className="font-semibold">{formData.name}</span> will:
                </p>
                <ul className="space-y-2 text-sm text-[#8F9BB3]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Keep all existing members and their data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Remove unit from assignment dropdowns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Preserve historical unit records and reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Members retain their unit history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>Can be restored at any time</span>
                  </li>
                </ul>

                {/* Warning for active members */}
                {unitData &&
                unitData.activeMembers &&
                unitData.activeMembers > 0 ? (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-orange-900">
                          <p className="font-medium mb-1">
                            Active Members Notice
                          </p>
                          <p className="text-orange-800">
                            This unit currently has{" "}
                            <span className="font-semibold">
                              {unitData.activeMembers} active member
                              {unitData.activeMembers > 1 ? "s" : ""}
                            </span>
                            . They will retain their unit assignment history,
                            but the unit will no longer appear in assignment
                            dropdowns for new assignments.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-900">
                          {unitData?.membersCount && unitData.membersCount > 0
                            ? `This unit has ${unitData.membersCount} member${unitData.membersCount > 1 ? "s" : ""} (inactive). All data will be preserved.`
                            : "This unit has no members."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowArchiveConfirm(false)}
                  className="flex-1 border-[#EDF1F7]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmArchive}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Unit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
