"use client"

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  MoreVertical,
  Eye,
  UserCheck,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Info,
  Search,
  Filter,
  Music,
  Award,
  ClipboardCheck,
} from "lucide-react";

interface ETSBatch {
  id: string;
  batchName: string;
  intakeMonth: "January" | "August";
  year: number;
  membersCount: number;
  capacity: number;
  completionStatus: "In Progress" | "Completed" | "Not Started";
  completionRate: number;
  startDate: string;
  endDate: string;
  hasLeadership: boolean;
  leadershipCount: number;
  pendingApprovals: number;
  bandEligibleCount: number;
  graduatedCount: number;
  isAutoCreated: boolean;
}

interface ETSBatchListProps {
  onViewBatch?: (batch: any) => void;
}

export function ETSBatchList({ onViewBatch }: ETSBatchListProps = {}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Mock ETS batches data
  const batches: ETSBatch[] = [
    // January 2026
    {
      id: "ets1",
      batchName: "ETSJAN2026",
      intakeMonth: "January",
      year: 2026,
      membersCount: 0,
      capacity: 60,
      completionStatus: "Not Started",
      completionRate: 0,
      startDate: "2026-01-05",
      endDate: "2026-06-30",
      hasLeadership: false,
      leadershipCount: 0,
      pendingApprovals: 0,
      bandEligibleCount: 0,
      graduatedCount: 0,
      isAutoCreated: true,
    },
    // August 2025
    {
      id: "ets2",
      batchName: "ETSAUG2025",
      intakeMonth: "August",
      year: 2025,
      membersCount: 52,
      capacity: 60,
      completionStatus: "In Progress",
      completionRate: 72,
      startDate: "2025-08-01",
      endDate: "2026-01-31",
      hasLeadership: true,
      leadershipCount: 4,
      pendingApprovals: 18,
      bandEligibleCount: 34,
      graduatedCount: 0,
      isAutoCreated: true,
    },
    // January 2025
    {
      id: "ets3",
      batchName: "ETSJAN2025",
      intakeMonth: "January",
      year: 2025,
      membersCount: 55,
      capacity: 60,
      completionStatus: "Completed",
      completionRate: 100,
      startDate: "2025-01-05",
      endDate: "2025-06-30",
      hasLeadership: true,
      leadershipCount: 4,
      pendingApprovals: 0,
      bandEligibleCount: 55,
      graduatedCount: 55,
      isAutoCreated: true,
    },
    // August 2024
    {
      id: "ets4",
      batchName: "ETSAUG2024",
      intakeMonth: "August",
      year: 2024,
      membersCount: 48,
      capacity: 60,
      completionStatus: "Completed",
      completionRate: 100,
      startDate: "2024-08-01",
      endDate: "2025-01-31",
      hasLeadership: true,
      leadershipCount: 4,
      pendingApprovals: 0,
      bandEligibleCount: 48,
      graduatedCount: 48,
      isAutoCreated: true,
    },
    // January 2024
    {
      id: "ets5",
      batchName: "ETSJAN2024",
      intakeMonth: "January",
      year: 2024,
      membersCount: 60,
      capacity: 60,
      completionStatus: "Completed",
      completionRate: 100,
      startDate: "2024-01-05",
      endDate: "2024-06-30",
      hasLeadership: true,
      leadershipCount: 4,
      pendingApprovals: 0,
      bandEligibleCount: 60,
      graduatedCount: 60,
      isAutoCreated: true,
    },
    // August 2023
    {
      id: "ets6",
      batchName: "ETSAUG2023",
      intakeMonth: "August",
      year: 2023,
      membersCount: 42,
      capacity: 60,
      completionStatus: "Completed",
      completionRate: 100,
      startDate: "2023-08-01",
      endDate: "2024-01-31",
      hasLeadership: true,
      leadershipCount: 4,
      pendingApprovals: 0,
      bandEligibleCount: 42,
      graduatedCount: 42,
      isAutoCreated: true,
    },
  ];

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.intakeMonth.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      yearFilter === "all" || batch.year.toString() === yearFilter;

    return matchesSearch && matchesYear;
  });

  // Separate batches by intake month
  const januaryBatches = filteredBatches
    .filter((batch) => batch.intakeMonth === "January")
    .sort((a, b) => b.year - a.year);

  const augustBatches = filteredBatches
    .filter((batch) => batch.intakeMonth === "August")
    .sort((a, b) => b.year - a.year);

  // Get unique years for filter
  const uniqueYears = Array.from(new Set(batches.map((b) => b.year))).sort(
    (a, b) => b - a,
  );

  const getStatusColor = (status: ETSBatch["completionStatus"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "In Progress":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Not Started":
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: ETSBatch["completionStatus"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-3 h-3" />;
      case "In Progress":
        return <Clock className="w-3 h-3" />;
      case "Not Started":
        return <Calendar className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewBatch = (batch: ETSBatch) => {
    console.log("View batch:", batch);
    if (onViewBatch) {
      onViewBatch(batch);
    }
  };

  const handleEditLeadership = (batch: ETSBatch) => {
    console.log("Edit leadership:", batch);
    alert(`Edit leadership for ${batch.batchName} modal would open here.`);
  };

  const renderBatchCard = (batch: ETSBatch) => (
    <Card
      key={batch.id}
      className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-[#222B45]">
                    {batch.batchName}
                  </h3>
                  {batch.isAutoCreated && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Auto-Created
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {batch.intakeMonth} {batch.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDate(batch.startDate)} -{" "}
                      {formatDate(batch.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setOpenMenuId(openMenuId === batch.id ? null : batch.id)
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#EDF1F7] py-1 z-20">
                    <button
                      onClick={() => {
                        handleViewBatch(batch);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Batch Details
                    </button>
                    <button
                      onClick={() => {
                        handleEditLeadership(batch);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Edit Batch Leadership
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Members Count */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8F9BB3]" />
                  <span className="text-sm font-medium text-[#222B45]">
                    Members Enrolled
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#222B45]">
                  {batch.membersCount} / {batch.capacity}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    batch.membersCount === 0
                      ? "bg-gray-300"
                      : batch.membersCount / batch.capacity >= 0.8
                        ? "bg-orange-500"
                        : "bg-teal-500"
                  }`}
                  style={{
                    width: `${(batch.membersCount / batch.capacity) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pending Approvals & Band Eligibility */}
          <div className="grid grid-cols-2 gap-3">
            {/* Pending Approvals */}
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-900">
                    Pending Approvals
                  </span>
                </div>
              </div>
              <p className="text-2xl font-semibold text-orange-700">
                {batch.pendingApprovals}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {batch.pendingApprovals > 0
                  ? "Awaiting review"
                  : "All processed"}
              </p>
            </div>

            {/* Band Eligibility */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-medium text-teal-900">
                    Band Eligible
                  </span>
                </div>
              </div>
              <p className="text-2xl font-semibold text-teal-700">
                {batch.bandEligibleCount}
              </p>
              <p className="text-xs text-teal-600 mt-1">
                {batch.bandEligibleCount > 0
                  ? `${Math.round((batch.bandEligibleCount / batch.membersCount) * 100)}% ready`
                  : "None ready"}
              </p>
            </div>
          </div>

          {/* Completion Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#8F9BB3]" />
                  <span className="text-sm font-medium text-[#222B45]">
                    Completion Progress
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#222B45]">
                  {batch.completionRate}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    batch.completionRate === 100
                      ? "bg-green-500"
                      : batch.completionRate >= 50
                        ? "bg-teal-500"
                        : "bg-gray-300"
                  }`}
                  style={{ width: `${batch.completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={getStatusColor(batch.completionStatus)}
              >
                {getStatusIcon(batch.completionStatus)}
                <span className="ml-1">{batch.completionStatus}</span>
              </Badge>

              {batch.hasLeadership ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  {batch.leadershipCount}{" "}
                  {batch.leadershipCount === 1 ? "Leader" : "Leaders"}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  No Leadership
                </Badge>
              )}

              {batch.graduatedCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {batch.graduatedCount} Graduated
                </Badge>
              )}
            </div>

            <Button
              onClick={() => handleViewBatch(batch)}
              size="sm"
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (month: string) => (
    <Card className="border-[#EDF1F7] shadow-sm">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-[#222B45] mb-2">
          No {month} Batches Found
        </h3>
        <p className="text-sm text-[#8F9BB3]">
          {searchQuery || yearFilter !== "all"
            ? "Try adjusting your filters to see more results."
            : `${month} batches will appear here when they are auto-created by the system.`}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-teal-900 mb-1">
              System-Managed Batches
            </h4>
            <p className="text-xs text-teal-700">
              ETS (Establishment) Class batches are automatically created by the
              system for January and August intake periods. Batches cannot be
              deleted but leadership and member assignments can be managed.
              Track band eligibility and approval status for each batch.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batches by name or month..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
          />
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8F9BB3]" />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white min-w-35"
          >
            <option value="all">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* January Batches Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">
                January Batches
              </h2>
              <p className="text-sm text-[#8F9BB3]">
                First semester intake (January - June)
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-teal-50 text-teal-700 border-teal-200"
          >
            {januaryBatches.length}{" "}
            {januaryBatches.length === 1 ? "Batch" : "Batches"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {januaryBatches.length > 0
            ? januaryBatches.map(renderBatchCard)
            : renderEmptyState("January")}
        </div>
      </div>

      {/* August Batches Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">
                August Batches
              </h2>
              <p className="text-sm text-[#8F9BB3]">
                Second semester intake (August - January)
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            {augustBatches.length}{" "}
            {augustBatches.length === 1 ? "Batch" : "Batches"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {augustBatches.length > 0
            ? augustBatches.map(renderBatchCard)
            : renderEmptyState("August")}
        </div>
      </div>
    </div>
  );
}
