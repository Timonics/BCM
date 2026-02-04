"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Crown,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserX,
  Music,
  Grid3x3,
  GraduationCap,
  UsersRound,
  Briefcase,
  Globe,
  Layers,
  Info,
} from "lucide-react";

interface LeadershipPosition {
  id: string;
  roleName: string;
  assignedMember: string | null;
  scope: "Global" | "Contextual";
  context?: string;
  startDate: string | null;
  endDate: string | null;
  status: "Active" | "Due" | "Expired" | "Vacant";
  daysUntilExpiry: number | null;
  category: "SIC" | "Band" | "Department" | "Unit" | "Class" | "Committee";
}

interface ViewLeadershipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: LeadershipPosition | null;
  onEdit?: () => void;
}

export default function ViewLeadershipDetailsModal({
  isOpen,
  onClose,
  position,
  onEdit,
}: ViewLeadershipDetailsModalProps) {
  if (!isOpen || !position) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Due":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Expired":
        return "bg-red-50 text-red-700 border-red-200";
      case "Vacant":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-5 h-5" />;
      case "Due":
        return <Clock className="w-5 h-5" />;
      case "Expired":
        return <XCircle className="w-5 h-5" />;
      case "Vacant":
        return <UserX className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "SIC":
        return <Crown className="w-6 h-6 text-purple-600" />;
      case "Band":
        return <Music className="w-6 h-6 text-blue-600" />;
      case "Department":
        return <Grid3x3 className="w-6 h-6 text-green-600" />;
      case "Unit":
        return <Briefcase className="w-6 h-6 text-teal-600" />;
      case "Class":
        return <GraduationCap className="w-6 h-6 text-orange-600" />;
      case "Committee":
        return <UsersRound className="w-6 h-6 text-pink-600" />;
      default:
        return <Crown className="w-6 h-6 text-gray-600" />;
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
        return "bg-teal-50 border-teal-200";
      case "Class":
        return "bg-orange-50 border-orange-200";
      case "Committee":
        return "bg-pink-50 border-pink-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = () => {
    if (!position.startDate || !position.endDate) return null;
    const start = new Date(position.startDate);
    const end = new Date(position.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return { years, months, totalDays: diffDays };
  };

  const duration = calculateDuration();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7] bg-[#F7F9FC]">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${getCategoryColor(position.category)} border flex items-center justify-center`}
            >
              {getCategoryIcon(position.category)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">
                Leadership Position Details
              </h2>
              <p className="text-sm text-[#8F9BB3] mt-0.5">
                {position.category} Leadership
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8F9BB3]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Role Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#8F9BB3] uppercase mb-3">
                Role Information
              </h3>
              <Card className="border-[#EDF1F7]">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-xs text-[#8F9BB3] font-medium">
                      Role Name
                    </label>
                    <p className="text-base font-semibold text-[#222B45] mt-1">
                      {position.roleName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#8F9BB3] font-medium">
                        Category
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={getCategoryColor(position.category)}
                        >
                          {position.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#8F9BB3] font-medium">
                        Scope
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={
                            position.scope === "Global"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {position.scope === "Global" ? (
                            <Globe className="w-3 h-3 mr-1" />
                          ) : (
                            <Layers className="w-3 h-3 mr-1" />
                          )}
                          {position.scope}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {position.context && (
                    <div>
                      <label className="text-xs text-[#8F9BB3] font-medium">
                        Context
                      </label>
                      <p className="text-sm text-[#222B45] mt-1">
                        {position.context}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Assignment Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#8F9BB3] uppercase mb-3">
                Assignment Information
              </h3>
              <Card className="border-[#EDF1F7]">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-xs text-[#8F9BB3] font-medium">
                      Assigned Member
                    </label>
                    {position.assignedMember ? (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-[#009AF4]/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-[#009AF4]" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-[#222B45]">
                            {position.assignedMember}
                          </p>
                          <p className="text-xs text-[#8F9BB3]">
                            Current Leader
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <UserX className="w-5 h-5 text-gray-500" />
                        <p className="text-sm text-gray-600 italic">
                          No member assigned to this position
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-[#8F9BB3] font-medium">
                      Status
                    </label>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeColor(position.status)} text-sm px-3 py-1`}
                      >
                        {getStatusIcon(position.status)}
                        <span className="ml-2">{position.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tenure Information */}
            {position.startDate && position.endDate && (
              <div>
                <h3 className="text-sm font-semibold text-[#8F9BB3] uppercase mb-3">
                  Tenure Information
                </h3>
                <Card className="border-[#EDF1F7]">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#8F9BB3] font-medium">
                          Start Date
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                          <p className="text-sm font-medium text-[#222B45]">
                            {formatDate(position.startDate)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[#8F9BB3] font-medium">
                          End Date
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                          <p className="text-sm font-medium text-[#222B45]">
                            {formatDate(position.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {duration && (
                      <div>
                        <label className="text-xs text-[#8F9BB3] font-medium">
                          Tenure Duration
                        </label>
                        <p className="text-sm text-[#222B45] mt-1">
                          {duration.years > 0 &&
                            `${duration.years} year${duration.years > 1 ? "s" : ""} `}
                          {duration.months > 0 &&
                            `${duration.months} month${duration.months > 1 ? "s" : ""}`}
                          <span className="text-[#8F9BB3] ml-2">
                            ({duration.totalDays} days)
                          </span>
                        </p>
                      </div>
                    )}

                    {position.daysUntilExpiry !== null && (
                      <div>
                        <label className="text-xs text-[#8F9BB3] font-medium">
                          Time Until Expiry
                        </label>
                        {position.daysUntilExpiry > 0 ? (
                          <div className="flex items-start gap-2 mt-2">
                            {position.daysUntilExpiry <= 90 ? (
                              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                            ) : (
                              <Clock className="w-4 h-4 text-green-600 mt-0.5" />
                            )}
                            <div>
                              <p
                                className={`text-sm font-medium ${position.daysUntilExpiry <= 90 ? "text-orange-600" : "text-green-600"}`}
                              >
                                {position.daysUntilExpiry} days remaining
                              </p>
                              {position.daysUntilExpiry <= 90 && (
                                <p className="text-xs text-orange-600 mt-1">
                                  ⚠️ Expiring soon - consider renewal
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-600">
                                Expired {Math.abs(position.daysUntilExpiry)}{" "}
                                days ago
                              </p>
                              <p className="text-xs text-red-600 mt-1">
                                ⚠️ Immediate renewal required
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {position.status === "Vacant" && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        Vacant Position
                      </p>
                      <p className="text-xs text-orange-800 mt-1">
                        This leadership position is currently vacant and needs a
                        member to be assigned. Click "Edit Assignment" to assign
                        a leader to this role.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#EDF1F7] bg-[#F7F9FC]">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#EDF1F7] hover:border-[#8F9BB3]"
          >
            Close
          </Button>
          {onEdit && (
            <Button
              onClick={onEdit}
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            >
              Edit Assignment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
