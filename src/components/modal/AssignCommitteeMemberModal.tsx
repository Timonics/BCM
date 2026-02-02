import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Toast from "../Toast";
import {
  X,
  UserPlus,
  Search,
  Crown,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Clock,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  avatar?: string;
  existingRoles?: Array<{
    projectName: string;
    role: string;
    roleType: "Leader" | "Member";
    startDate: string;
    endDate: string;
    status: "Active" | "Ended";
  }>;
}

interface AssignCommitteeMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignment: {
    memberId: string;
    memberName: string;
    roleType: "Leader" | "Member";
    leadershipPosition?: "Chairperson" | "Secretary" | "Coordinator";
    customRole?: string;
    startDate: string;
    endDate: string;
    allowMultipleRoles: boolean;
    isActingRole: boolean;
  }) => void;
  projectName: string;
  existingCommitteeMembers: Array<{ id: string; name: string; role: string }>;
}

export default function AssignCommitteeMemberModal({
  isOpen,
  onClose,
  onAssign,
  projectName,
  existingCommitteeMembers,
}: AssignCommitteeMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [roleType, setRoleType] = useState<"Leader" | "Member">("Member");
  const [leadershipPosition, setLeadershipPosition] = useState<
    "Chairperson" | "Secretary" | "Coordinator"
  >("Chairperson");
  const [customRole, setCustomRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allowMultipleRoles, setAllowMultipleRoles] = useState(false);
  const [isActingRole, setIsActingRole] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock members data
  const allMembers: Member[] = [
    {
      id: "m1",
      name: "Pastor David Mensah",
      email: "david.mensah@church.org",
      phone: "+233 20 123 4567",
      unit: "Accra Central",
      existingRoles: [
        {
          projectName: "Easter Revival Campaign 2025",
          role: "Chairperson",
          roleType: "Leader",
          startDate: "2025-01-10",
          endDate: "2025-02-10",
          status: "Active",
        },
      ],
    },
    {
      id: "m2",
      name: "Sister Grace Owusu",
      email: "grace.owusu@church.org",
      phone: "+233 24 234 5678",
      unit: "Tema",
      existingRoles: [],
    },
    {
      id: "m3",
      name: "Brother Emmanuel Asante",
      email: "emmanuel.asante@church.org",
      phone: "+233 50 345 6789",
      unit: "Kumasi",
      existingRoles: [
        {
          projectName: "Easter Revival Campaign 2025",
          role: "Secretary",
          roleType: "Leader",
          startDate: "2025-01-12",
          endDate: "2026-01-12",
          status: "Active",
        },
      ],
    },
    {
      id: "m4",
      name: "Sister Abena Kofi",
      email: "abena.kofi@church.org",
      phone: "+233 27 456 7890",
      unit: "Accra Central",
      existingRoles: [],
    },
    {
      id: "m5",
      name: "Brother Kwame Boateng",
      email: "kwame.boateng@church.org",
      phone: "+233 20 567 8901",
      unit: "Takoradi",
      existingRoles: [],
    },
    {
      id: "m6",
      name: "Sister Ama Ofori",
      email: "ama.ofori@church.org",
      phone: "+233 24 678 9012",
      unit: "Cape Coast",
      existingRoles: [],
    },
    {
      id: "m7",
      name: "Brother Kofi Appiah",
      email: "kofi.appiah@church.org",
      phone: "+233 50 789 0123",
      unit: "Accra Central",
      existingRoles: [
        {
          projectName: "Youth Conference 2025",
          role: "Media Coordinator",
          roleType: "Member",
          startDate: "2024-12-01",
          endDate: "2025-12-01",
          status: "Active",
        },
      ],
    },
    {
      id: "m8",
      name: "Sister Efua Mensah",
      email: "efua.mensah@church.org",
      phone: "+233 27 890 1234",
      unit: "Tema",
      existingRoles: [],
    },
  ];

  // Filter members based on search query
  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedMember(null);
      setRoleType("Member");
      setLeadershipPosition("Chairperson");
      setCustomRole("");
      setStartDate("");
      setEndDate("");
      setAllowMultipleRoles(false);
      setIsActingRole(false);
      setErrors({});
      setShowSuccessToast(false);
      setShowDropdown(false);
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMember) {
      newErrors.member = "Please select a member";
    }

    if (roleType === "Member" && !customRole.trim()) {
      newErrors.customRole = "Please specify the committee role";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // Check for duplicate assignment
    if (selectedMember) {
      const isDuplicate = existingCommitteeMembers.some(
        (member) => member.id === selectedMember.id
      );
      if (isDuplicate && !allowMultipleRoles) {
        newErrors.member =
          'This member is already assigned to this project. Enable "Allow multiple roles" to continue.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAssign = () => {
    if (!validateForm() || !selectedMember) {
      return;
    }

    const assignment = {
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      roleType,
      leadershipPosition:
        roleType === "Leader" ? leadershipPosition : undefined,
      customRole: roleType === "Member" ? customRole : undefined,
      startDate,
      endDate,
      allowMultipleRoles,
      isActingRole,
    };

    onAssign(assignment);
    setShowSuccessToast(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setShowDropdown(false);
    setSearchQuery(member.name);
    if (errors.member) {
      setErrors({ ...errors, member: "" });
    }
  };

  const isAlreadyAssigned = selectedMember
    ? existingCommitteeMembers.some((member) => member.id === selectedMember.id)
    : false;

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-[#009AF4]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#222B45]">
                  Assign Committee Member
                </h2>
                <p className="text-sm text-[#8F9BB3] mt-0.5">
                  Add a member to {projectName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F9FC] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#8F9BB3]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              {/* Select Member */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Select Member <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                        if (
                          selectedMember &&
                          e.target.value !== selectedMember.name
                        ) {
                          setSelectedMember(null);
                        }
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search by name, email, or unit..."
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                        errors.member
                          ? "border-red-300 bg-red-50"
                          : "border-[#EDF1F7]"
                      }`}
                    />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && searchQuery && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-[#EDF1F7] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {filteredMembers.length > 0 ? (
                        <div className="py-1">
                          {filteredMembers.map((member) => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => handleSelectMember(member)}
                              className="w-full px-4 py-3 hover:bg-[#F7F9FC] transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#009AF4] text-sm font-semibold">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-[#222B45] truncate">
                                    {member.name}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-[#8F9BB3] mt-0.5">
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {member.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {member.unit}
                                    </span>
                                  </div>
                                </div>
                                {member.existingRoles &&
                                  member.existingRoles.length > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                    >
                                      {member.existingRoles.length}{" "}
                                      {member.existingRoles.length === 1
                                        ? "Role"
                                        : "Roles"}
                                    </Badge>
                                  )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-[#8F9BB3]">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          No members found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.member && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.member}
                  </p>
                )}
              </div>

              {/* Selected Member Info */}
              {selectedMember && (
                <div className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#009AF4] font-semibold">
                        {selectedMember.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#222B45]">
                        {selectedMember.name}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#8F9BB3] mt-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">
                            {selectedMember.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{selectedMember.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span>{selectedMember.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Existing Roles */}
                  {selectedMember.existingRoles &&
                    selectedMember.existingRoles.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#EDF1F7]">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="w-4 h-4 text-[#009AF4]" />
                          <p className="text-sm font-medium text-[#222B45]">
                            Existing Committee Roles
                          </p>
                        </div>
                        <div className="space-y-2">
                          {selectedMember.existingRoles.map((role, index) => (
                            <div
                              key={index}
                              className="p-3 bg-white border border-[#EDF1F7] rounded-lg"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#222B45] truncate">
                                    {role.projectName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className={
                                        role.roleType === "Leader"
                                          ? "bg-purple-50 text-purple-700 border-purple-200 text-xs"
                                          : "bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                      }
                                    >
                                      {role.roleType === "Leader" && (
                                        <Crown className="w-3 h-3 mr-1" />
                                      )}
                                      {role.roleType === "Member" && (
                                        <Users className="w-3 h-3 mr-1" />
                                      )}
                                      {role.role}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={
                                        role.status === "Active"
                                          ? "bg-green-50 text-green-700 border-green-200 text-xs"
                                          : "bg-gray-50 text-gray-700 border-gray-200 text-xs"
                                      }
                                    >
                                      {role.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[#8F9BB3]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(role.startDate)}
                                </span>
                                <span>→</span>
                                <span>{formatDate(role.endDate)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Already Assigned Warning */}
                  {isAlreadyAssigned && !allowMultipleRoles && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800">
                        <p className="font-medium mb-1">Already Assigned</p>
                        <p>
                          This member is already assigned to this project.
                          Enable "Allow multiple roles" below to assign
                          additional responsibilities.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Committee Role Type */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Committee Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRoleType("Leader")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      roleType === "Leader"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-[#EDF1F7] hover:border-purple-500/50 text-[#8F9BB3]"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Crown className="w-6 h-6" />
                      <div className="text-center">
                        <p className="font-semibold text-sm">Leader</p>
                        <p className="text-xs opacity-75">
                          Leadership position
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoleType("Member")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      roleType === "Member"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-[#EDF1F7] hover:border-blue-500/50 text-[#8F9BB3]"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-6 h-6" />
                      <div className="text-center">
                        <p className="font-semibold text-sm">Member</p>
                        <p className="text-xs opacity-75">Committee member</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Leadership Position (if Leader selected) */}
              {roleType === "Leader" && (
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Leadership Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={leadershipPosition}
                    onChange={(e) =>
                      setLeadershipPosition(
                        e.target.value as
                          | "Chairperson"
                          | "Secretary"
                          | "Coordinator"
                      )
                    }
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                  >
                    <option value="Chairperson">Chairperson</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
                </div>
              )}

              {/* Custom Role (if Member selected) */}
              {roleType === "Member" && (
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Committee Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => {
                      setCustomRole(e.target.value);
                      if (errors.customRole) {
                        setErrors({ ...errors, customRole: "" });
                      }
                    }}
                    placeholder="e.g., Media Coordinator, Logistics Lead, etc."
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                      errors.customRole
                        ? "border-red-300 bg-red-50"
                        : "border-[#EDF1F7]"
                    }`}
                  />
                  {errors.customRole && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.customRole}
                    </p>
                  )}
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
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
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
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

              {/* Options */}
              <div className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#009AF4]" />
                  <p className="text-sm font-medium text-[#222B45]">
                    Assignment Options
                  </p>
                </div>

                {/* Allow Multiple Roles Toggle */}
                <label className="flex items-center justify-between p-3 bg-white border border-[#EDF1F7] rounded-lg cursor-pointer hover:border-[#009AF4] transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#222B45]">
                      Allow multiple roles
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      Member can have multiple responsibilities in this project
                    </p>
                  </div>
                  <div className="relative ml-4">
                    <input
                      type="checkbox"
                      checked={allowMultipleRoles}
                      onChange={(e) => {
                        setAllowMultipleRoles(e.target.checked);
                        if (e.target.checked && errors.member) {
                          setErrors({ ...errors, member: "" });
                        }
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${
                        allowMultipleRoles ? "bg-[#009AF4]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform ${
                          allowMultipleRoles
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </label>

                {/* Acting Role Toggle */}
                <label className="flex items-center justify-between p-3 bg-white border border-[#EDF1F7] rounded-lg cursor-pointer hover:border-[#009AF4] transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#222B45]">
                      Acting role
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      Temporary assignment (will be marked as "Acting")
                    </p>
                  </div>
                  <div className="relative ml-4">
                    <input
                      type="checkbox"
                      checked={isActingRole}
                      onChange={(e) => setIsActingRole(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${
                        isActingRole ? "bg-[#009AF4]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform transform ${
                          isActingRole ? "translate-x-6" : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#EDF1F7] bg-[#F7F9FC]">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          isVisible
          message="Committee member assigned successfully!"
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </>
  );
}
