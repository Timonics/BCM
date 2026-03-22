"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CSVImportModal from "@/components/modal/csv-import";
import {
  Search,
  UserPlus,
  Upload,
  Download,
  Filter,
  Eye,
  Pencil,
  Trash2,
  TriangleAlert,
  AlertCircle,
  Clock,
  X,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useMembers,
  useMembersOverview,
  useDeleteMember,
  useExportMembers,
} from "@/hooks/useMembers";
import { MembersData } from "@/types/members.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Helper function to calculate age from DOB
const calculateAge = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Shadcn Skeleton Loader Components
const TableSkeleton = () => (
  <div className="w-full">
    {/* Desktop Table Skeleton */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#EDF1F7] bg-[#F7F9FC]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <th key={i} className="px-6 py-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-b border-[#EDF1F7]">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-12" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card Skeleton */}
    <div className="md:hidden divide-y divide-[#EDF1F7]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="flex-1 h-9 rounded" />
            <Skeleton className="flex-1 h-9 rounded" />
            <Skeleton className="flex-1 h-9 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Card
        key={i}
        className="border-[#EDF1F7] shadow-sm border-l-4 border-l-gray-200 z-9999"
      >
        <CardContent className="p-3 sm:p-4 space-y-2">
          <Skeleton className="h-4 w-24 " />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const FilterSkeleton = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export default function MembershipListDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<MembersData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filters state
  const [filters, setFilters] = useState({
    gender: "all",
    bandId: "all",
    unitId: "all",
    classBatchId: "all",
    status: "all",
  });

  // Prepare API filters
  const apiFilters = {
    search: searchQuery || undefined,
    gender: filters.gender !== "all" ? filters.gender : undefined,
    bandId: filters.bandId !== "all" ? filters.bandId : undefined,
    unitId: filters.unitId !== "all" ? filters.unitId : undefined,
    classBatchId:
      filters.classBatchId !== "all" ? filters.classBatchId : undefined,
    status:
      filters.status !== "all"
        ? (filters.status as "active" | "suspended" | "overgrown")
        : undefined,
    limit: itemsPerPage,
    page: currentPage,
  };

  // Fetch members data
  const { data: members, isLoading, error, refetch } = useMembers(apiFilters);

  // Fetch overview statistics
  const { data: overview, isLoading: overviewLoading } = useMembersOverview();

  // Delete member mutation
  const { deleteMember, isDeleting } = useDeleteMember();

  // Export members mutation
  const { exportMembers, isExporting } = useExportMembers();

  // Handle delete confirmation
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    await deleteMember(memberToDelete.id);
    setMemberToDelete(null);
  };

  // Handle export
  const handleExport = async () => {
    const exportFilters = {
      search: searchQuery || undefined,
      gender: filters.gender !== "all" ? filters.gender : undefined,
      bandId: filters.bandId !== "all" ? filters.bandId : undefined,
      unitId: filters.unitId !== "all" ? filters.unitId : undefined,
      classBatchId:
        filters.classBatchId !== "all" ? filters.classBatchId : undefined,
      status:
        filters.status !== "all"
          ? (filters.status as "active" | "suspended" | "overgrown")
          : undefined,
    };

    await exportMembers(exportFilters);
  };

  // Get suspension status color
  const getSuspensionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      case "overgrown":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const clearFilters = () => {
    setFilters({
      gender: "all",
      bandId: "all",
      unitId: "all",
      classBatchId: "all",
      status: "all",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const activeFilterCount =
    Object.values(filters).filter((v) => v !== "all").length +
    (searchQuery ? 1 : 0);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate pagination
  const totalPages = Math.ceil((members?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMembers = members?.slice(startIndex, endIndex) || [];

  return (
    <div className="space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#222B45]">
            Membership List
          </h2>
          <p className="text-sm text-[#8F9BB3] mt-1">
            Manage and view all church members
          </p>
        </div>
        <div className="flex flex-row justify-end gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
            onClick={() => setIsCSVModalOpen(true)}
          >
            <Upload className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button
            size="sm"
            className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            onClick={() => router.push("/dashboard/members/add")}
          >
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Member</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="text"
                  placeholder="Search by name, ID, band, or unit..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full lg:w-auto lg:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 lg:flex-none border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009AF4] text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 lg:flex-none border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="flex-1 lg:flex-none border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#EDF1F7]">
              {isLoading ? (
                <FilterSkeleton />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Gender Filter */}
                    <div>
                      <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          value={filters.gender}
                          onChange={(e) => {
                            setFilters({ ...filters, gender: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                        >
                          <option value="all">All Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={filters.status}
                          onChange={(e) => {
                            setFilters({ ...filters, status: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="overgrown">Overgrown</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <div className="mt-3 flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-[#009AF4] hover:text-[#0086D6] hover:bg-[#009AF4]/10"
                      >
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Summary - with Skeleton */}
      {overviewLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-[#009AF4]">
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-[#8F9BB3]">
                Total Members
              </div>
              <div className="text-xl sm:text-2xl font-semibold text-[#222B45] mt-1">
                {overview?.totalMembers || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-green-500">
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-[#8F9BB3]">Active</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#222B45] mt-1">
                {overview?.active || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-orange-500">
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-[#8F9BB3]">Overgrown</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#222B45] mt-1">
                {overview?.overgrown || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-red-500">
            <CardContent className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-[#8F9BB3]">Suspended</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#222B45] mt-1">
                {overview?.suspended || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Members Table/Cards with Skeleton */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-[#8F9BB3] text-center mb-4">
                {error.message || "Failed to load members"}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : !members || members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <UserPlus className="w-12 h-12 text-[#8F9BB3] mb-4" />
              <p className="text-[#8F9BB3] text-center">
                No members found. Try adjusting your filters or add a new
                member.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EDF1F7] bg-[#F7F9FC]">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                        Name
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                        Gender
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                        Age
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                        Member Code
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-[#EDF1F7] hover:bg-[#F7F9FC] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#009AF4]/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-[#009AF4]">
                                {member.firstName[0]}
                                {member.surname[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-[#222B45] whitespace-nowrap">
                                {member.firstName} {member.surname}
                              </div>
                              <div className="text-xs text-[#8F9BB3]">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#222B45] capitalize">
                            {member.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#222B45]">
                            {calculateAge(member.dob)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={`text-xs whitespace-nowrap ${getSuspensionStatusColor(member.suspensionStatus)}`}
                          >
                            {member.suspensionStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#222B45] font-mono">
                            {member.memberCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-[#009AF4]/10 hover:text-[#009AF4]"
                              title="View details"
                              onClick={() =>
                                router.push(`/dashboard/members/${member.id}`)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-[#009AF4]/10 hover:text-[#009AF4]"
                              title="Edit member"
                              onClick={() =>
                                router.push(
                                  `/dashboard/members/${member.id}/edit`,
                                )
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Delete member"
                              onClick={() => setMemberToDelete(member)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-[#EDF1F7]">
                {displayedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 hover:bg-[#F7F9FC] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#009AF4]/10 flex items-center justify-center">
                          <span className="text-base font-semibold text-[#009AF4]">
                            {member.firstName[0]}
                            {member.surname[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#222B45]">
                            {member.firstName} {member.surname}
                          </h3>
                          <p className="text-xs text-[#8F9BB3]">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSuspensionStatusColor(member.suspensionStatus)}`}
                      >
                        {member.suspensionStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-[#8F9BB3]">Member Code</p>
                        <p className="font-mono text-sm">{member.memberCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8F9BB3]">Gender</p>
                        <p className="capitalize">{member.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8F9BB3]">Age</p>
                        <p>{calculateAge(member.dob)} years</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#EDF1F7]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/dashboard/members/${member.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          router.push(`/dashboard/members/${member.id}/edit`)
                        }
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setMemberToDelete(member)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-[#EDF1F7]">
                  <p className="text-sm text-[#8F9BB3] order-2 sm:order-1">
                    Showing{" "}
                    <span className="font-medium text-[#222B45]">
                      {startIndex + 1}-{Math.min(endIndex, members.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[#222B45]">
                      {members.length}
                    </span>{" "}
                    members
                  </p>
                  <div className="flex gap-2 order-1 sm:order-2 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-[#EDF1F7]"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          className={
                            currentPage === pageNum
                              ? "bg-[#009AF4] hover:bg-[#0086D6] text-white min-w-9"
                              : "border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] min-w-9"
                          }
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-[#EDF1F7]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImportComplete={(data) => {
          console.log("Import completed:", data);
          setIsCSVModalOpen(false);
          refetch();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={() => setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              member
              {memberToDelete &&
                ` "${memberToDelete.firstName} ${memberToDelete.surname}"`}
              and remove all associated data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
