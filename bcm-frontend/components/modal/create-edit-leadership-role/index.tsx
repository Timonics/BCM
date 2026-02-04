"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Crown,
  CheckCircle,
  Info,
  AlertCircle,
  Music,
  Grid3x3,
  GraduationCap,
  UsersRound,
  Globe,
  Layers,
  Calendar,
  AlertTriangle,
  Building2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateEditLeadershipRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (roleData: RoleFormData) => void;
  roleData?: {
    id: string;
    roleName: string;
    category: "SIC" | "Band" | "Department" | "Unit" | "Class" | "Committee";
    scopeType: "Global" | "Contextual";
    requiresTenure: boolean;
    defaultTenureDuration?: number;
    tenureUnit?: "months" | "years";
    canHoldMultipleRoles: boolean;
    description: string;
    departmentId?: string;
  };
  mode?: "create" | "edit";
}

interface RoleFormData {
  id?: string;
  roleName: string;
  category: "SIC" | "Band" | "Department" | "Unit" | "Class" | "Committee";
  scopeType: "Global" | "Contextual";
  requiresTenure: boolean;
  defaultTenureDuration?: number;
  tenureUnit: "months" | "years";
  canHoldMultipleRoles: boolean;
  description: string;
  departmentId?: string;
}

export default function CreateEditLeadershipRoleModal({
  isOpen,
  onClose,
  onSave,
  roleData,
  mode = "create",
}: CreateEditLeadershipRoleModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    roleName: "",
    category: "Band",
    scopeType: "Contextual",
    requiresTenure: false,
    tenureUnit: "months",
    canHoldMultipleRoles: false,
    description: "",
  });

  const [originalData, setOriginalData] = useState<RoleFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form data when modal opens or roleData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && roleData) {
        const initialData = {
          id: roleData.id,
          roleName: roleData.roleName,
          category: roleData.category,
          scopeType: roleData.scopeType,
          requiresTenure: roleData.requiresTenure,
          defaultTenureDuration: roleData.defaultTenureDuration,
          tenureUnit: roleData.tenureUnit || "months",
          canHoldMultipleRoles: roleData.canHoldMultipleRoles,
          description: roleData.description || "",
          departmentId: roleData.departmentId,
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } else {
        // Reset for create mode
        setFormData({
          roleName: "",
          category: "Band",
          scopeType: "Contextual",
          requiresTenure: false,
          tenureUnit: "months",
          canHoldMultipleRoles: false,
          description: "",
        });
        setOriginalData(null);
      }
    }
  }, [isOpen, mode, roleData]);

  const validateField = (name: string, value: any) => {
    switch (name) {
      case "roleName":
        if (!value || value.trim() === "") {
          return "Role name is required";
        }
        if (value.length < 3) {
          return "Role name must be at least 3 characters";
        }
        return "";
      case "defaultTenureDuration":
        if (formData.requiresTenure && value) {
          if (value < 1) {
            return "Duration must be at least 1";
          }
          if (value > 120) {
            return "Duration seems too long";
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
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isFormValid = () => {
    // Check required fields
    if (!formData.roleName || formData.roleName.trim() === "") return false;
    if (formData.roleName.length < 3) return false;

    // Check if there are any errors
    return Object.values(errors).every((error) => error === "");
  };

  const hasChanges = () => {
    if (mode === "create") return true;
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      roleName: true,
    });

    if (isFormValid()) {
      onSave?.(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      roleName: "",
      category: "Band",
      scopeType: "Contextual",
      requiresTenure: false,
      tenureUnit: "months",
      canHoldMultipleRoles: false,
      description: "",
    });
    setOriginalData(null);
    setErrors({});
    setTouched({});
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "SIC":
        return <Crown className="w-5 h-5 text-purple-600" />;
      case "Band":
        return <Music className="w-5 h-5 text-blue-600" />;
      case "Department":
        return <Grid3x3 className="w-5 h-5 text-green-600" />;
      case "Unit":
        return <Grid3x3 className="w-5 h-5 text-green-600" />;
      case "Class":
        return <GraduationCap className="w-5 h-5 text-orange-600" />;
      case "Committee":
        return <UsersRound className="w-5 h-5 text-pink-600" />;
      default:
        return <Crown className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SIC":
        return "bg-purple-50 border-purple-200";
      case "Band":
        return "bg-blue-50 border-blue-200";
      case "Department":
        return "bg-green-50 border-green-200";
      case "Unit":
        return "bg-green-50 border-green-200";
      case "Class":
        return "bg-orange-50 border-orange-200";
      case "Committee":
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#009AF4]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">
                {mode === "create"
                  ? "Create Leadership Role"
                  : "Edit Leadership Role"}
              </h2>
              <p className="text-sm text-[#8F9BB3] mt-0.5">
                Define a reusable leadership role template
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
                {/* Role Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.roleName}
                    onChange={(e) =>
                      handleInputChange("roleName", e.target.value)
                    }
                    onBlur={() => handleBlur("roleName")}
                    placeholder="e.g., Band Leader, Head of Unit, Class Teacher"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                      touched.roleName && errors.roleName
                        ? "border-red-300 bg-red-50"
                        : "border-[#EDF1F7]"
                    }`}
                  />
                  {touched.roleName && errors.roleName && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.roleName}</span>
                    </div>
                  )}
                </div>

                {/* Role Category */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Role Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(
                      [
                        "SIC",
                        "Band",
                        "Department",
                        "Unit",
                        "Class",
                        "Committee",
                      ] as const
                    ).map((category) => (
                      <label
                        key={category}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50 ${
                          formData.category === category
                            ? `border-[#009AF4] ${getCategoryColor(category)}`
                            : "border-[#EDF1F7] bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={formData.category === category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className="sr-only"
                        />
                        {getCategoryIcon(category)}
                        <span className="text-sm font-medium text-[#222B45]">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Department Selection - Only shown for Unit category */}
                {formData.category === "Unit" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Assign to Department{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.departmentId}
                      onValueChange={(value) =>
                        handleInputChange("departmentId", value)
                      }
                    >
                      <SelectTrigger className="w-full border-[#EDF1F7]">
                        <SelectValue placeholder="Select the department this unit belongs to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dept1">
                          Christian Education Department
                        </SelectItem>
                        <SelectItem value="dept2">
                          Media & Technology Department
                        </SelectItem>
                        <SelectItem value="dept3">
                          Welfare & Community Department
                        </SelectItem>
                        <SelectItem value="dept4">
                          Music & Worship Department
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-900">
                          <span className="font-medium">
                            Unit leadership requires department assignment:
                          </span>{" "}
                          This unit will be placed under the selected
                          department. All unit leadership roles will be tracked
                          within this department's structure.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Role Description{" "}
                    <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe the responsibilities and expectations for this role..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm resize-none"
                  />
                  <p className="text-xs text-[#8F9BB3] mt-1">
                    {formData.description.length} / 500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Role Scope Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  2
                </div>
                Role Scope
              </h3>

              <div className="space-y-3">
                {/* Global Scope Option */}
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50 ${
                    formData.scopeType === "Global"
                      ? "border-[#009AF4] bg-purple-50"
                      : "border-[#EDF1F7]"
                  }`}
                >
                  <div className="flex items-center h-6">
                    <input
                      type="radio"
                      name="scopeType"
                      value="Global"
                      checked={formData.scopeType === "Global"}
                      onChange={(e) =>
                        handleInputChange("scopeType", e.target.value)
                      }
                      className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] focus:ring-[#009AF4] focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-[#222B45]">
                        Global - Single Holder
                      </span>
                      {formData.scopeType === "Global" && (
                        <CheckCircle className="w-4 h-4 text-[#009AF4]" />
                      )}
                    </div>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Only <span className="font-semibold">one person</span> can
                      hold this role across the entire organization. Perfect for
                      positions like National Overseer, Church Secretary, or
                      Regional Pastor.
                    </p>
                    {formData.scopeType === "Global" &&
                      formData.category === "SIC" && (
                        <Card className="border-purple-200 bg-purple-50 mt-3">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-purple-900">
                                <span className="font-medium">
                                  SIC roles enforce single assignment:
                                </span>{" "}
                                Only one member can be assigned to this role at
                                any time across the entire church.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                  </div>
                </label>

                {/* Contextual Scope Option */}
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50 ${
                    formData.scopeType === "Contextual"
                      ? "border-[#009AF4] bg-blue-50"
                      : "border-[#EDF1F7]"
                  }`}
                >
                  <div className="flex items-center h-6">
                    <input
                      type="radio"
                      name="scopeType"
                      value="Contextual"
                      checked={formData.scopeType === "Contextual"}
                      onChange={(e) =>
                        handleInputChange("scopeType", e.target.value)
                      }
                      className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] focus:ring-[#009AF4] focus:ring-2"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-[#222B45]">
                        Contextual - Per Band/Unit
                      </span>
                      {formData.scopeType === "Contextual" && (
                        <CheckCircle className="w-4 h-4 text-[#009AF4]" />
                      )}
                    </div>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      This role can be assigned to{" "}
                      <span className="font-semibold">
                        one person per band, unit, class, or committee
                      </span>
                      . Perfect for Band Leader, Head of Unit, or Class Teacher
                      where each context needs its own leader.
                    </p>
                    {formData.scopeType === "Contextual" && (
                      <Card className="border-blue-200 bg-blue-50 mt-3">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-900">
                              <span className="font-medium">
                                Contextual roles require target selection:
                              </span>{" "}
                              When assigning this role, you'll need to specify
                              which {formData.category.toLowerCase()} the person
                              will lead.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Tenure and Permissions Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  3
                </div>
                Tenure and Permissions
              </h3>

              <div className="space-y-4">
                {/* Default Tenure Duration */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="font-medium text-[#222B45] text-sm">
                        Default Tenure Duration
                      </label>
                      <p className="text-xs text-[#8F9BB3] mt-0.5">
                        Set a default term length for this role
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "requiresTenure",
                          !formData.requiresTenure,
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.requiresTenure ? "bg-[#009AF4]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.requiresTenure
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {formData.requiresTenure && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-[#222B45] mb-2">
                          Duration
                        </label>
                        <input
                          type="number"
                          value={formData.defaultTenureDuration || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "defaultTenureDuration",
                              parseInt(e.target.value) || undefined,
                            )
                          }
                          onBlur={() => handleBlur("defaultTenureDuration")}
                          placeholder="24"
                          min="1"
                          max="120"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                            touched.defaultTenureDuration &&
                            errors.defaultTenureDuration
                              ? "border-red-300 bg-red-50"
                              : "border-[#EDF1F7] bg-white"
                          }`}
                        />
                        {touched.defaultTenureDuration &&
                          errors.defaultTenureDuration && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.defaultTenureDuration}</span>
                            </div>
                          )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#222B45] mb-2">
                          Unit
                        </label>
                        <select
                          value={formData.tenureUnit}
                          onChange={(e) =>
                            handleInputChange("tenureUnit", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm bg-white"
                        >
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                      {formData.defaultTenureDuration && (
                        <div className="col-span-2">
                          <Card className="border-green-200 bg-green-50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-green-900">
                                  Default tenure:{" "}
                                  <span className="font-semibold">
                                    {formData.defaultTenureDuration}{" "}
                                    {formData.tenureUnit}
                                  </span>
                                  {formData.tenureUnit === "months" &&
                                    formData.defaultTenureDuration >= 12 && (
                                      <span className="text-green-800">
                                        {" "}
                                        (
                                        {Math.floor(
                                          formData.defaultTenureDuration / 12,
                                        )}{" "}
                                        year
                                        {Math.floor(
                                          formData.defaultTenureDuration / 12,
                                        ) > 1
                                          ? "s"
                                          : ""}
                                        )
                                      </span>
                                    )}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}

                  {!formData.requiresTenure && (
                    <Card className="border-gray-200 bg-gray-50">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-800">
                            No tenure duration required. Assignments will have
                            no automatic expiry date.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Can Hold Multiple Roles */}
                <div className="flex items-center justify-between p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-[#222B45] text-sm">
                      Can Hold Multiple Roles
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      {formData.canHoldMultipleRoles
                        ? "Members can hold this role while serving in other leadership positions"
                        : "Members must be dedicated to this single leadership role"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        "canHoldMultipleRoles",
                        !formData.canHoldMultipleRoles,
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                      formData.canHoldMultipleRoles
                        ? "bg-[#009AF4]"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.canHoldMultipleRoles
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {formData.canHoldMultipleRoles && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-900">
                          <span className="font-medium">
                            Multiple role assignment enabled:
                          </span>{" "}
                          When assigning this role, the system will allow
                          members who already hold other leadership positions.
                          Ensure this aligns with your church's governance
                          policies.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EDF1F7] p-6 bg-white">
          <div className="flex items-center justify-between gap-4 mb-4">
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
                disabled={!isFormValid() || (mode === "edit" && !hasChanges())}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {mode === "create" ? "Create Role" : "Save Changes"}
              </Button>
            </div>
          </div>
          {!isFormValid() && Object.keys(touched).length > 0 && (
            <p className="text-xs text-red-600 text-left">
              Please fill in all required fields correctly
            </p>
          )}
          {mode === "edit" && isFormValid() && !hasChanges() && (
            <p className="text-xs text-[#8F9BB3] text-left">
              No changes detected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
