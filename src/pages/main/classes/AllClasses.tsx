import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BatchNamingRulesCard } from "@/components/class-batch-list/BatchNamingRulesCard";
import { PreYouthBatchList } from "@/components/class-batch-list/PreYouthBatchList";
import { PreYouthBatchModal } from "@/components/modal/PreYouthBatchModal";
import { BaptismalBatchList } from "@/components/class-batch-list/BaptismalBatchList";
import { ETSBatchList } from "@/components/class-batch-list/ETSBatchList";
import {
  GraduationCap,
  Plus,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  Award,
  FileText,
  Download,
  UserCheck,
  ClipboardList,
  Target,
  BookOpen,
  School,
} from "lucide-react";

type ClassType = "pre-youth" | "baptismal" | "ets";
type BatchStatus = "Active" | "Completed" | "Upcoming" | "Registration";

interface Batch {
  id: string;
  batchName: string;
  year: number;
  intake: string;
  membersCount: number;
  capacity: number;
  status: BatchStatus;
  startDate: string;
  endDate: string;
  instructor?: string;
  classType: ClassType;
  readyForGraduation?: number;
  pendingApprovals?: number;
  completionRate?: number;
}

interface ClassManagementOverviewProps {
  onNavigateToPreYouthDetail?: () => void;
  onNavigateToBaptismalDetail?: () => void;
  onNavigateToETSDetail?: () => void;
}

export default function AllClasses() {
  const [activeTab, setActiveTab] = useState<ClassType>("baptismal");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showPreYouthModal, setShowPreYouthModal] = useState(false);
  const [preYouthModalMode, setPreYouthModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingBatch, setEditingBatch] = useState<any>(null);

  // Mock batch data
  const batches: Batch[] = [
    // Baptismal Class Batches
    {
      id: "b1",
      batchName: "Baptismal Class - Q1 2025",
      year: 2025,
      intake: "Q1",
      membersCount: 45,
      capacity: 50,
      status: "Active",
      startDate: "2025-01-15",
      endDate: "2025-03-31",
      instructor: "Pastor David Mensah",
      classType: "baptismal",
      readyForGraduation: 38,
      pendingApprovals: 7,
      completionRate: 85,
    },
    {
      id: "b2",
      batchName: "Baptismal Class - Q2 2025",
      year: 2025,
      intake: "Q2",
      membersCount: 28,
      capacity: 50,
      status: "Registration",
      startDate: "2025-04-01",
      endDate: "2025-06-30",
      instructor: "Elder Grace Owusu",
      classType: "baptismal",
      readyForGraduation: 0,
      pendingApprovals: 0,
      completionRate: 0,
    },
    {
      id: "b3",
      batchName: "Baptismal Class - Q4 2024",
      year: 2024,
      intake: "Q4",
      membersCount: 52,
      capacity: 50,
      status: "Completed",
      startDate: "2024-10-01",
      endDate: "2024-12-20",
      instructor: "Pastor David Mensah",
      classType: "baptismal",
      readyForGraduation: 52,
      pendingApprovals: 0,
      completionRate: 100,
    },
    {
      id: "b4",
      batchName: "Baptismal Class - Q3 2024",
      year: 2024,
      intake: "Q3",
      membersCount: 41,
      capacity: 50,
      status: "Completed",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      instructor: "Elder Joseph Asamoah",
      classType: "baptismal",
      readyForGraduation: 41,
      pendingApprovals: 0,
      completionRate: 100,
    },

    // ETS Class Batches
    {
      id: "e1",
      batchName: "ETS Class 2025 - Cohort A",
      year: 2025,
      intake: "Cohort A",
      membersCount: 32,
      capacity: 35,
      status: "Active",
      startDate: "2025-01-10",
      endDate: "2025-12-15",
      instructor: "Bishop Emmanuel Asante",
      classType: "ets",
      readyForGraduation: 0,
      pendingApprovals: 5,
      completionRate: 45,
    },
    {
      id: "e2",
      batchName: "ETS Class 2024",
      year: 2024,
      intake: "Annual",
      membersCount: 28,
      capacity: 30,
      status: "Completed",
      startDate: "2024-01-15",
      endDate: "2024-12-10",
      instructor: "Bishop Emmanuel Asante",
      classType: "ets",
      readyForGraduation: 28,
      pendingApprovals: 0,
      completionRate: 100,
    },
    {
      id: "e3",
      batchName: "ETS Class 2026 - Cohort A",
      year: 2026,
      intake: "Cohort A",
      membersCount: 15,
      capacity: 35,
      status: "Registration",
      startDate: "2026-01-10",
      endDate: "2026-12-15",
      instructor: "Bishop Emmanuel Asante",
      classType: "ets",
      readyForGraduation: 0,
      pendingApprovals: 0,
      completionRate: 0,
    },

    // Pre-Youth Class Batches
    {
      id: "p1",
      batchName: "Pre-Youth Class 2025",
      year: 2025,
      intake: "Annual",
      membersCount: 64,
      capacity: 80,
      status: "Active",
      startDate: "2025-01-05",
      endDate: "2025-11-30",
      instructor: "Sister Abena Kofi",
      classType: "pre-youth",
      readyForGraduation: 12,
      pendingApprovals: 3,
      completionRate: 35,
    },
    {
      id: "p2",
      batchName: "Pre-Youth Class 2024",
      year: 2024,
      intake: "Annual",
      membersCount: 58,
      capacity: 70,
      status: "Completed",
      startDate: "2024-01-08",
      endDate: "2024-11-25",
      instructor: "Sister Ama Ofori",
      classType: "pre-youth",
      readyForGraduation: 58,
      pendingApprovals: 0,
      completionRate: 100,
    },
  ];

  // Filter batches by active tab
  const filteredBatches = batches.filter(
    (batch) => batch.classType === activeTab
  );

  // Calculate statistics for active tab
  const activeBatches = filteredBatches.filter(
    (b) => b.status === "Active" || b.status === "Registration"
  ).length;
  const totalMembers = filteredBatches
    .filter((b) => b.status === "Active")
    .reduce((sum, b) => sum + b.membersCount, 0);
  const readyForGraduation = filteredBatches
    .filter((b) => b.status === "Active")
    .reduce((sum, b) => sum + (b.readyForGraduation || 0), 0);
  const pendingApprovals = filteredBatches
    .filter((b) => b.status === "Active")
    .reduce((sum, b) => sum + (b.pendingApprovals || 0), 0);

  const getStatusBadgeColor = (status: BatchStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Completed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Registration":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: BatchStatus) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-3 h-3" />;
      case "Completed":
        return <Award className="w-3 h-3" />;
      case "Upcoming":
        return <Calendar className="w-3 h-3" />;
      case "Registration":
        return <UserPlus className="w-3 h-3" />;
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

  const getClassTypeLabel = (type: ClassType) => {
    switch (type) {
      case "pre-youth":
        return "Pre-Youth Class";
      case "baptismal":
        return "Baptismal Class";
      case "ets":
        return "ETS Class";
    }
  };

  const getClassTypeIcon = (type: ClassType) => {
    switch (type) {
      case "pre-youth":
        return <Users className="w-5 h-5" />;
      case "baptismal":
        return <BookOpen className="w-5 h-5" />;
      case "ets":
        return <School className="w-5 h-5" />;
    }
  };

  const canCreateBatch = (type: ClassType) => {
    // Pre-Youth class is auto-created annually, so manual creation not allowed
    return type !== "pre-youth";
  };

  const handleCreateBatch = () => {
    console.log("Create batch for:", activeTab);
    alert(
      `Create ${getClassTypeLabel(activeTab)} batch modal would open here.`
    );
  };

  //   const handleViewBatch = (batch: Batch) => {
  //     console.log('View batch:', batch);
  //     if (activeTab === 'pre-youth') {
  //       onNavigateToPreYouthDetail();
  //     } else if (activeTab === 'baptismal' && onNavigateToBaptismalDetail) {
  //       onNavigateToBaptismalDetail();
  //     } else if (activeTab === 'ets' && onNavigateToETSDetail) {
  //       onNavigateToETSDetail();
  //     } else {
  //       alert(`Navigate to ${batch.batchName} detail page.`);
  //     }
  //   };

  const handleEditBatch = (batch: Batch) => {
    console.log("Edit batch:", batch);
    setEditingBatch(batch);
    setPreYouthModalMode("edit");
    setShowPreYouthModal(true);
  };

  const handleDeleteBatch = (batch: Batch) => {
    console.log("Delete batch:", batch);
    if (confirm(`Are you sure you want to delete ${batch.batchName}?`)) {
      alert("Batch deleted successfully.");
    }
  };

  const handleArchiveBatch = (batch: any) => {
    console.log("Archive batch:", batch);
    if (confirm(`Are you sure you want to archive ${batch.batchName}?`)) {
      alert("Batch archived successfully.");
    }
  };

  // Convert batches to PreYouth format for the PreYouthBatchList component
  const preYouthBatches = filteredBatches
    .filter((b) => b.classType === "pre-youth")
    .map((b) => ({
      id: b.id,
      batchName: b.batchName,
      year: b.year,
      membersCount: b.membersCount,
      capacity: b.capacity,
      status: b.status as "Active" | "Completed" | "Archived",
      startDate: b.startDate,
      endDate: b.endDate,
      instructor: b.instructor,
      hasLeadershipAssigned: Math.random() > 0.3, // Mock data
      readyForGraduation: b.readyForGraduation || 0,
      completionRate: b.completionRate || 0,
      attendanceRate: Math.round(75 + Math.random() * 20), // Mock data: 75-95%
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#009AF4]/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#009AF4]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#222B45]">
                Class Management
              </h1>
              <p className="text-[#8F9BB3] mt-1">
                Member training and integration lifecycle
              </p>
            </div>
          </div>
        </div>

        {canCreateBatch(activeTab) && (
          <Button
            onClick={handleCreateBatch}
            className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#EDF1F7]">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("pre-youth")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
              activeTab === "pre-youth"
                ? "text-[#009AF4] border-b-2 border-[#009AF4]"
                : "text-[#8F9BB3] hover:text-[#222B45]"
            }`}
          >
            <Users className="w-4 h-4" />
            Pre-Youth Class
          </button>
          <button
            onClick={() => setActiveTab("baptismal")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
              activeTab === "baptismal"
                ? "text-[#009AF4] border-b-2 border-[#009AF4]"
                : "text-[#8F9BB3] hover:text-[#222B45]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Baptismal Class
          </button>
          <button
            onClick={() => setActiveTab("ets")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
              activeTab === "ets"
                ? "text-[#009AF4] border-b-2 border-[#009AF4]"
                : "text-[#8F9BB3] hover:text-[#222B45]"
            }`}
          >
            <School className="w-4 h-4" />
            ETS Class
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Active Batches</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {activeBatches}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    Currently Running
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">
                  Members in Classes
                </p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {totalMembers}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Users className="w-3 h-3 text-[#009AF4]" />
                  <span className="text-xs text-[#8F9BB3]">
                    Active enrollment
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#009AF4]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">
                  Ready for Graduation
                </p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {readyForGraduation}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Award className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-600">
                    Completed requirements
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Pending Approvals</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {pendingApprovals}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-orange-600" />
                  <span className="text-xs text-orange-600">
                    Awaiting review
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Banner for Pre-Youth */}
      {activeTab === "pre-youth" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Automatic Batch Creation
                </h4>
                <p className="text-sm text-blue-700">
                  Pre-Youth Class batches are automatically created annually.
                  Manual batch creation is not required for this class type.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#222B45]">
            {getClassTypeLabel(activeTab)} Batches
          </h2>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {filteredBatches.length}{" "}
            {filteredBatches.length === 1 ? "Batch" : "Batches"}
          </Badge>
        </div>

        {/* Pre-Youth: Use specialized year-based list */}
        {activeTab === "pre-youth" ? (
          <PreYouthBatchList batches={preYouthBatches} />
        ) : activeTab === "baptismal" ? (
          /* Baptismal: Use specialized January/August sections */
          <BaptismalBatchList />
        ) : activeTab === "ets" ? (
          /* ETS: Use specialized January/August sections */
          <ETSBatchList />
        ) : (
          /* Fallback: Use regular grid layout */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Batch Naming Rules Card */}
            <div className="lg:col-span-1">
              <BatchNamingRulesCard />
            </div>

            {/* Batch Cards */}
            <div className="lg:col-span-3">
              {filteredBatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBatches.map((batch) => (
                    <Card
                      key={batch.id}
                      className="border-[#EDF1F7] shadow-sm hover:shadow-lg transition-all hover:border-[#009AF4]/30"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center shrink-0">
                              {getClassTypeIcon(batch.classType)}
                              <span className="text-[#009AF4]">
                                {getClassTypeIcon(batch.classType)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-semibold text-[#222B45] mb-1 truncate"
                                title={batch.batchName}
                              >
                                {batch.batchName}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={getStatusBadgeColor(batch.status)}
                                >
                                  {getStatusIcon(batch.status)}
                                  <span className="ml-1">{batch.status}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>
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
                                    //   handleViewBatch(batch);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleEditBatch(batch);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Batch
                                  </button>
                                  <button className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Manage Members
                                  </button>
                                  <button className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    View Reports
                                  </button>
                                  <div className="border-t border-[#EDF1F7] my-1" />
                                  <button
                                    onClick={() => {
                                      handleDeleteBatch(batch);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Batch
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Year and Intake */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-[#8F9BB3] mb-1">Year</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                              <span className="font-medium text-[#222B45]">
                                {batch.year}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-[#8F9BB3] mb-1">
                              Intake
                            </p>
                            <Badge
                              variant="outline"
                              className="bg-indigo-50 text-indigo-700 border-indigo-200"
                            >
                              {batch.intake}
                            </Badge>
                          </div>
                        </div>

                        {/* Members Count */}
                        <div>
                          <p className="text-xs text-[#8F9BB3] mb-2">
                            Members Enrolled
                          </p>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-[#009AF4]" />
                              <span className="font-semibold text-[#222B45]">
                                {batch.membersCount}
                              </span>
                              <span className="text-xs text-[#8F9BB3]">
                                / {batch.capacity}
                              </span>
                            </div>
                            <span className="text-xs text-[#8F9BB3]">
                              {Math.round(
                                (batch.membersCount / batch.capacity) * 100
                              )}
                              % filled
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#009AF4] transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (batch.membersCount / batch.capacity) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="p-3 bg-[#F7F9FC] rounded-lg">
                          <p className="text-xs text-[#8F9BB3] mb-2">
                            Duration
                          </p>
                          <div className="flex items-center gap-2 text-sm text-[#222B45]">
                            <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                            <span>{formatDate(batch.startDate)}</span>
                            <span className="text-[#8F9BB3]">→</span>
                            <span>{formatDate(batch.endDate)}</span>
                          </div>
                        </div>

                        {/* Instructor */}
                        {batch.instructor && (
                          <div className="flex items-center gap-2 text-sm">
                            <UserCheck className="w-4 h-4 text-[#8F9BB3]" />
                            <span className="text-[#222B45]">
                              {batch.instructor}
                            </span>
                          </div>
                        )}

                        {/* Additional Stats for Active Batches */}
                        {batch.status === "Active" && (
                          <div className="pt-3 border-t border-[#EDF1F7] space-y-2">
                            {batch.completionRate !== undefined && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-blue-600" />
                                  <span className="text-[#8F9BB3]">
                                    Completion Rate
                                  </span>
                                </div>
                                <span className="font-medium text-blue-600">
                                  {batch.completionRate}%
                                </span>
                              </div>
                            )}
                            {batch.readyForGraduation !== undefined &&
                              batch.readyForGraduation > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-purple-600" />
                                    <span className="text-[#8F9BB3]">
                                      Ready to Graduate
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700 border-purple-200"
                                  >
                                    {batch.readyForGraduation}
                                  </Badge>
                                </div>
                              )}
                            {batch.pendingApprovals !== undefined &&
                              batch.pendingApprovals > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                    <span className="text-[#8F9BB3]">
                                      Pending Approvals
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-orange-50 text-orange-700 border-orange-200"
                                  >
                                    {batch.pendingApprovals}
                                  </Badge>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                        //   onClick={() => handleViewBatch(batch)}
                          className="w-full bg-[#009AF4] hover:bg-[#0086D6] text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Batch Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <Card className="border-[#EDF1F7] shadow-sm">
                  <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <GraduationCap className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#222B45] mb-2">
                        No Batches Found
                      </h3>
                      <p className="text-sm text-[#8F9BB3] mb-4 max-w-md">
                        {canCreateBatch(activeTab)
                          ? `No ${getClassTypeLabel(
                              activeTab
                            ).toLowerCase()} batches have been created yet. Create your first batch to get started.`
                          : `No ${getClassTypeLabel(
                              activeTab
                            ).toLowerCase()} batches available. Batches are created automatically.`}
                      </p>
                      {canCreateBatch(activeTab) && (
                        <Button
                          onClick={handleCreateBatch}
                          className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Batch
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pre-Youth Batch Modal */}
      <PreYouthBatchModal
        isOpen={showPreYouthModal}
        onClose={() => {
          setShowPreYouthModal(false);
          setEditingBatch(null);
        }}
        onSave={(batchData) => {
          console.log("Save Pre-Youth Batch:", batchData);
          alert(
            `Pre-Youth Batch ${
              preYouthModalMode === "create" ? "created" : "updated"
            } successfully: ${batchData.batchName}`
          );
          setShowPreYouthModal(false);
          setEditingBatch(null);
        }}
        mode={preYouthModalMode}
        batch={
          editingBatch
            ? {
                id: editingBatch.id,
                year: editingBatch.year,
                setIdentifier:
                  editingBatch.batchName?.match(/SET(\d+)/)?.[1] || "",
                description: `Pre-Youth Class batch for ${editingBatch.year}`,
                status: editingBatch.status as
                  | "Active"
                  | "Completed"
                  | "Archived",
              }
            : null
        }
      />
    </div>
  );
}
