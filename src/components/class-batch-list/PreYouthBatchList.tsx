import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Users,
  Calendar,
  Award,
  UserCheck,
  Eye,
  Edit,
  Archive,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
} from "lucide-react";

interface PreYouthBatch {
  id: string;
  batchName: string;
  year: number;
  membersCount: number;
  capacity: number;
  status: "Active" | "Completed" | "Archived";
  startDate: string;
  endDate: string;
  instructor?: string;
  hasLeadershipAssigned: boolean;
  readyForGraduation: number;
  completionRate: number;
  attendanceRate?: number;
}

interface PreYouthBatchListProps {
  batches: PreYouthBatch[];
  onViewBatch?: (batch: any) => void;
  onEditBatch?: (batch: any) => void;
  onArchiveBatch?: (batch: any) => void;
}

export function PreYouthBatchList({ batches }: PreYouthBatchListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Group batches by year (descending order)
  const batchesByYear = batches.reduce((acc, batch) => {
    if (!acc[batch.year]) {
      acc[batch.year] = [];
    }
    acc[batch.year].push(batch);
    return acc;
  }, {} as Record<number, PreYouthBatch[]>);

  const years = Object.keys(batchesByYear)
    .map(Number)
    .sort((a, b) => b - a); // Descending order (newest first)

  const getStatusBadgeColor = (status: PreYouthBatch["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Archived":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: PreYouthBatch["status"]) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />;
      case "Completed":
        return <Award className="w-3 h-3" />;
      case "Archived":
        return <Archive className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGraduationReadinessBadge = (batch: PreYouthBatch) => {
    const percentage = (batch.readyForGraduation / batch.membersCount) * 100;

    if (percentage >= 80) {
      return {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "High Readiness",
      };
    } else if (percentage >= 50) {
      return {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Moderate Readiness",
      };
    } else {
      return {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Low Readiness",
      };
    }
  };

  return (
    <div className="space-y-8">
      {years.length > 0 ? (
        years.map((year) => {
          const yearBatches = batchesByYear[year];
          const isCurrentYear = year === new Date().getFullYear();

          return (
            <div key={year} className="space-y-4">
              {/* Year Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#009AF4]" />
                  <h3 className="text-xl font-semibold text-[#222B45]">
                    {year}
                  </h3>
                  {isCurrentYear && (
                    <Badge
                      variant="outline"
                      className="bg-[#009AF4]/10 text-[#009AF4] border-[#009AF4]/30"
                    >
                      Current Year
                    </Badge>
                  )}
                </div>
                <div className="flex-1 h-px bg-[#EDF1F7]" />
                <span className="text-sm text-[#8F9BB3]">
                  {yearBatches.length}{" "}
                  {yearBatches.length === 1 ? "Batch" : "Batches"}
                </span>
              </div>

              {/* Batch Cards for this year */}
              <div className="grid grid-cols-1 gap-4">
                {yearBatches.map((batch) => {
                  const readinessBadge = getGraduationReadinessBadge(batch);

                  return (
                    <Card
                      key={batch.id}
                      className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-all hover:border-[#009AF4]/30"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                          {/* Left Section: Batch Info */}
                          <div className="flex-1 space-y-4">
                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                  <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className="font-semibold text-[#222B45] mb-2 truncate"
                                    title={batch.batchName}
                                  >
                                    {batch.batchName}
                                  </h4>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className={getStatusBadgeColor(
                                        batch.status
                                      )}
                                    >
                                      {getStatusIcon(batch.status)}
                                      <span className="ml-1">
                                        {batch.status}
                                      </span>
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-indigo-50 text-indigo-700 border-indigo-200"
                                    >
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {batch.year}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Actions Menu */}
                              <div className="relative shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId === batch.id ? null : batch.id
                                    )
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>

                                {openMenuId === batch.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setOpenMenuId(null)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#EDF1F7] py-1 z-20">
                                      <button
                                        onClick={() => {
                                          //   onViewBatch(batch);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Batch
                                      </button>
                                      <button
                                        onClick={() => {
                                          //   onEditBatch(batch);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                      >
                                        <Edit className="w-4 h-4" />
                                        Edit Batch
                                      </button>
                                      {batch.status !== "Archived" && (
                                        <>
                                          <div className="border-t border-[#EDF1F7] my-1" />
                                          <button
                                            onClick={() => {
                                              //   onArchiveBatch(batch);
                                              setOpenMenuId(null);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                          >
                                            <Archive className="w-4 h-4" />
                                            Archive Batch
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {/* Members Count */}
                              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Users className="w-4 h-4 text-[#009AF4]" />
                                  <span className="text-xs text-[#8F9BB3]">
                                    Members
                                  </span>
                                </div>
                                <p className="text-lg font-semibold text-[#222B45]">
                                  {batch.membersCount}
                                </p>
                                <p className="text-xs text-[#8F9BB3] mt-0.5">
                                  of {batch.capacity}
                                </p>
                              </div>

                              {/* Leadership Assigned */}
                              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <UserCheck className="w-4 h-4 text-[#8F9BB3]" />
                                  <span className="text-xs text-[#8F9BB3]">
                                    Leadership
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  {batch.hasLeadershipAssigned ? (
                                    <>
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                      <span className="text-sm font-medium text-green-700">
                                        Assigned
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-5 h-5 text-orange-600" />
                                      <span className="text-sm font-medium text-orange-700">
                                        Pending
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Graduation Readiness */}
                              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Award className="w-4 h-4 text-[#8F9BB3]" />
                                  <span className="text-xs text-[#8F9BB3]">
                                    Ready to Graduate
                                  </span>
                                </div>
                                <p className="text-lg font-semibold text-[#222B45]">
                                  {batch.readyForGraduation}
                                </p>
                                <p className="text-xs text-[#8F9BB3] mt-0.5">
                                  {Math.round(
                                    (batch.readyForGraduation /
                                      batch.membersCount) *
                                      100
                                  )}
                                  % ready
                                </p>
                              </div>

                              {/* Completion Rate */}
                              <div className="p-3 bg-[#F7F9FC] rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-4 h-4 text-[#8F9BB3]" />
                                  <span className="text-xs text-[#8F9BB3]">
                                    Completion
                                  </span>
                                </div>
                                <p className="text-lg font-semibold text-[#222B45]">
                                  {batch.completionRate}%
                                </p>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                                  <div
                                    className="h-full bg-[#009AF4] transition-all duration-300"
                                    style={{
                                      width: `${batch.completionRate}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Additional Info Row */}
                            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#EDF1F7]">
                              {/* Duration */}
                              <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(batch.startDate)} →{" "}
                                  {formatDate(batch.endDate)}
                                </span>
                              </div>

                              {/* Instructor */}
                              {batch.instructor && (
                                <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                                  <UserCheck className="w-4 h-4" />
                                  <span>{batch.instructor}</span>
                                </div>
                              )}

                              {/* Attendance Rate */}
                              {batch.attendanceRate !== undefined && (
                                <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>
                                    {batch.attendanceRate}% attendance
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Section: Readiness Badge & Actions */}
                          <div className="lg:w-48 flex lg:flex-col items-center lg:items-stretch gap-3 lg:gap-4">
                            {/* Graduation Readiness Badge */}
                            <div className="flex-1 lg:flex-none">
                              <div className="p-4 bg-white border-2 border-dashed rounded-lg text-center">
                                <div className="flex flex-col items-center gap-2">
                                  <div
                                    className={`w-10 h-10 rounded-full ${readinessBadge.color} flex items-center justify-center`}
                                  >
                                    {readinessBadge.icon}
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#8F9BB3] mb-1">
                                      Readiness Status
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className={readinessBadge.color}
                                    >
                                      {readinessBadge.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Primary Action */}
                            <Button
                              //   onClick={() => onViewBatch(batch)}
                              className="flex-1 lg:flex-none bg-[#009AF4] hover:bg-[#0086D6] text-white"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Note for current year */}
              {isCurrentYear && yearBatches.length === 1 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Note:</span> Only one
                      Pre-Youth batch is allowed per year. This batch is
                      automatically created at the beginning of the year.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        /* Empty State */
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#222B45] mb-2">
                No Pre-Youth Batches
              </h3>
              <p className="text-sm text-[#8F9BB3] max-w-md">
                Pre-Youth Class batches are automatically created at the
                beginning of each year. Check back soon or contact system
                administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
