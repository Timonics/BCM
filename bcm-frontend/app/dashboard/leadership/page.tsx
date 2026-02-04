"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateEditLeadershipRoleModal from "@/components/modal/create-edit-leadership-role";
import AssignLeadershipRoleModal from "@/components/modal/assign-leadership-role";
import ViewLeadershipDetailsModal from "@/components/modal/view-leadership-details";
import {
  Crown,
  AlertTriangle,
  UserX,
  ShieldAlert,
  UserPlus,
  Plus,
  Filter,
  Search,
  FileDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Music,
  Grid3x3,
  GraduationCap,
  UsersRound,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
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

export default function LeadershipConsolidationDashboard() {
  const [activeTab, setActiveTab] = useState<
    "SIC" | "Band" | "Department" | "Unit" | "Class" | "Committee"
  >("SIC");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<LeadershipPosition | null>(null);

  // Mock leadership data
  const leadershipPositions: LeadershipPosition[] = [
    // SIC Leadership
    {
      id: "sic1",
      roleName: "National Overseer",
      assignedMember: "Bishop Michael Thompson",
      scope: "Global",
      startDate: "2022-01-15",
      endDate: "2026-01-14",
      status: "Active",
      daysUntilExpiry: 380,
      category: "SIC",
    },
    {
      id: "sic2",
      roleName: "Regional Pastor",
      assignedMember: "Pastor David Wilson",
      scope: "Global",
      startDate: "2023-03-20",
      endDate: "2025-03-19",
      status: "Due",
      daysUntilExpiry: 78,
      category: "SIC",
    },
    {
      id: "sic3",
      roleName: "Church Secretary",
      assignedMember: "Sister Grace Adams",
      scope: "Global",
      startDate: "2021-06-10",
      endDate: "2024-12-31",
      status: "Expired",
      daysUntilExpiry: -30,
      category: "SIC",
    },
    {
      id: "sic4",
      roleName: "Financial Secretary",
      assignedMember: null,
      scope: "Global",
      startDate: null,
      endDate: null,
      status: "Vacant",
      daysUntilExpiry: null,
      category: "SIC",
    },
    {
      id: "sic5",
      roleName: "Youth Coordinator",
      assignedMember: "Brother John Smith",
      scope: "Global",
      startDate: "2023-09-01",
      endDate: "2025-08-31",
      status: "Active",
      daysUntilExpiry: 244,
      category: "SIC",
    },

    // Band Leadership
    {
      id: "band1",
      roleName: "Band Leader",
      assignedMember: "Brother James Parker",
      scope: "Contextual",
      context: "Youth Band",
      startDate: "2023-01-15",
      endDate: "2025-01-14",
      status: "Active",
      daysUntilExpiry: 15,
      category: "Band",
    },
    {
      id: "band2",
      roleName: "Assistant Band Leader",
      assignedMember: "Sister Sarah Johnson",
      scope: "Contextual",
      context: "Youth Band",
      startDate: "2023-06-01",
      endDate: "2025-05-31",
      status: "Active",
      daysUntilExpiry: 152,
      category: "Band",
    },
    {
      id: "band3",
      roleName: "Band Leader",
      assignedMember: null,
      scope: "Contextual",
      context: "Senior Band",
      startDate: null,
      endDate: null,
      status: "Vacant",
      daysUntilExpiry: null,
      category: "Band",
    },
    {
      id: "band4",
      roleName: "Band Leader",
      assignedMember: "Brother Thomas Lee",
      scope: "Contextual",
      context: "Men Band",
      startDate: "2022-03-10",
      endDate: "2024-12-25",
      status: "Expired",
      daysUntilExpiry: -6,
      category: "Band",
    },
    {
      id: "band5",
      roleName: "Band Secretary",
      assignedMember: "Sister Emily Davis",
      scope: "Contextual",
      context: "Women Band",
      startDate: "2023-08-15",
      endDate: "2025-02-28",
      status: "Due",
      daysUntilExpiry: 59,
      category: "Band",
    },

    // Department Leadership
    {
      id: "unit1",
      roleName: "Head of Unit",
      assignedMember: "Brother Matthew King",
      scope: "Contextual",
      context: "Teaching Unit",
      startDate: "2023-01-15",
      endDate: "2025-01-14",
      status: "Due",
      daysUntilExpiry: 15,
      category: "Department",
    },
    {
      id: "unit2",
      roleName: "Assistant Head",
      assignedMember: "Sister Rachel Adams",
      scope: "Contextual",
      context: "Teaching Unit",
      startDate: "2023-06-01",
      endDate: "2025-05-31",
      status: "Active",
      daysUntilExpiry: 152,
      category: "Department",
    },
    {
      id: "unit3",
      roleName: "Secretary",
      assignedMember: "Sister Grace Wilson",
      scope: "Contextual",
      context: "Teaching Unit",
      startDate: "2022-09-10",
      endDate: "2024-12-31",
      status: "Expired",
      daysUntilExpiry: -1,
      category: "Department",
    },
    {
      id: "unit4",
      roleName: "Head of Unit",
      assignedMember: null,
      scope: "Contextual",
      context: "Media Unit",
      startDate: null,
      endDate: null,
      status: "Vacant",
      daysUntilExpiry: null,
      category: "Department",
    },
    {
      id: "unit5",
      roleName: "Head of Unit",
      assignedMember: "Brother David Chen",
      scope: "Contextual",
      context: "Welfare Unit",
      startDate: "2022-11-01",
      endDate: "2025-10-31",
      status: "Active",
      daysUntilExpiry: 305,
      category: "Department",
    },

    // Unit Leadership (within Departments)
    {
      id: "unitL1",
      roleName: "Head of Unit",
      assignedMember: "Brother Matthew King",
      scope: "Contextual",
      context: "Teaching Unit",
      startDate: "2023-01-15",
      endDate: "2025-01-14",
      status: "Due",
      daysUntilExpiry: 15,
      category: "Unit",
    },
    {
      id: "unitL2",
      roleName: "Assistant Head",
      assignedMember: "Sister Rachel Adams",
      scope: "Contextual",
      context: "Teaching Unit",
      startDate: "2023-06-01",
      endDate: "2025-05-31",
      status: "Active",
      daysUntilExpiry: 152,
      category: "Unit",
    },
    {
      id: "unitL3",
      roleName: "Secretary",
      assignedMember: "Sister Grace Wilson",
      scope: "Contextual",
      context: "Teaching Unit",
      startDate: "2022-09-10",
      endDate: "2024-12-31",
      status: "Expired",
      daysUntilExpiry: -1,
      category: "Unit",
    },
    {
      id: "unitL4",
      roleName: "Head of Unit",
      assignedMember: null,
      scope: "Contextual",
      context: "Media Production Unit",
      startDate: null,
      endDate: null,
      status: "Vacant",
      daysUntilExpiry: null,
      category: "Unit",
    },
    {
      id: "unitL5",
      roleName: "Head of Unit",
      assignedMember: "Brother David Chen",
      scope: "Contextual",
      context: "Welfare Unit",
      startDate: "2022-11-01",
      endDate: "2025-10-31",
      status: "Active",
      daysUntilExpiry: 305,
      category: "Unit",
    },
    {
      id: "unitL6",
      roleName: "Head of Unit",
      assignedMember: "Sister Elizabeth Brown",
      scope: "Contextual",
      context: "Curriculum Development Unit",
      startDate: "2023-03-01",
      endDate: "2025-02-28",
      status: "Active",
      daysUntilExpiry: 59,
      category: "Unit",
    },
    {
      id: "unitL7",
      roleName: "Technical Lead",
      assignedMember: "Brother James Wilson",
      scope: "Contextual",
      context: "IT Support Unit",
      startDate: "2023-03-01",
      endDate: "2025-02-28",
      status: "Active",
      daysUntilExpiry: 59,
      category: "Unit",
    },

    // Class Leadership
    {
      id: "class1",
      roleName: "Class Teacher",
      assignedMember: "Sister Anna Mitchell",
      scope: "Contextual",
      context: "New Convert Class",
      startDate: "2023-04-15",
      endDate: "2025-04-14",
      status: "Active",
      daysUntilExpiry: 105,
      category: "Class",
    },
    {
      id: "class2",
      roleName: "Class Coordinator",
      assignedMember: "Brother Peter Brown",
      scope: "Contextual",
      context: "Bible Study Class",
      startDate: "2022-07-20",
      endDate: "2024-12-20",
      status: "Expired",
      daysUntilExpiry: -11,
      category: "Class",
    },
    {
      id: "class3",
      roleName: "Class Teacher",
      assignedMember: null,
      scope: "Contextual",
      context: "Youth Leadership Class",
      startDate: null,
      endDate: null,
      status: "Vacant",
      daysUntilExpiry: null,
      category: "Class",
    },
    {
      id: "class4",
      roleName: "Class Assistant",
      assignedMember: "Sister Jennifer White",
      scope: "Contextual",
      context: "Sunday School",
      startDate: "2023-09-10",
      endDate: "2025-02-15",
      status: "Due",
      daysUntilExpiry: 46,
      category: "Class",
    },

    // Committee Leadership
    {
      id: "comm1",
      roleName: "Committee Chairman",
      assignedMember: "Brother Robert Johnson",
      scope: "Contextual",
      context: "Finance Committee",
      startDate: "2023-02-01",
      endDate: "2026-01-31",
      status: "Active",
      daysUntilExpiry: 397,
      category: "Committee",
    },
    {
      id: "comm2",
      roleName: "Committee Secretary",
      assignedMember: "Sister Linda Davis",
      scope: "Contextual",
      context: "Events Committee",
      startDate: "2022-05-15",
      endDate: "2025-01-10",
      status: "Due",
      daysUntilExpiry: 10,
      category: "Committee",
    },
    {
      id: "comm3",
      roleName: "Committee Chairman",
      assignedMember: null,
      scope: "Contextual",
      context: "Disciplinary Committee",
      startDate: null,
      endDate: null,
      status: "Vacant",
      daysUntilExpiry: null,
      category: "Committee",
    },
    {
      id: "comm4",
      roleName: "Committee Member",
      assignedMember: "Brother Charles Wilson",
      scope: "Contextual",
      context: "Building Committee",
      startDate: "2021-11-20",
      endDate: "2024-11-19",
      status: "Expired",
      daysUntilExpiry: -42,
      category: "Committee",
    },
  ];

  // Calculate summary stats
  const totalActiveLeaders = leadershipPositions.filter(
    (pos) => pos.status === "Active",
  ).length;
  const rolesDueSoon = leadershipPositions.filter(
    (pos) => pos.status === "Due",
  ).length;
  const vacantPositions = leadershipPositions.filter(
    (pos) => pos.status === "Vacant",
  ).length;
  const expiredPositions = leadershipPositions.filter(
    (pos) => pos.status === "Expired",
  ).length;

  // Filter positions by active tab
  const filteredByTab = leadershipPositions.filter(
    (pos) => pos.category === activeTab,
  );

  // Apply search and status filters
  const filteredPositions = filteredByTab.filter((pos) => {
    const matchesSearch =
      pos.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pos.assignedMember &&
        pos.assignedMember.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pos.context &&
        pos.context.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || pos.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        return <CheckCircle className="w-3 h-3" />;
      case "Due":
        return <Clock className="w-3 h-3" />;
      case "Expired":
        return <XCircle className="w-3 h-3" />;
      case "Vacant":
        return <UserX className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "SIC":
        return <Crown className="w-5 h-5" />;
      case "Band":
        return <Music className="w-5 h-5" />;
      case "Department":
        return <Grid3x3 className="w-5 h-5" />;
      case "Unit":
        return <Briefcase className="w-5 h-5" />;
      case "Class":
        return <GraduationCap className="w-5 h-5" />;
      case "Committee":
        return <UsersRound className="w-5 h-5" />;
      default:
        return <Crown className="w-5 h-5" />;
    }
  };

  const getCategoryCount = (category: string) => {
    return leadershipPositions.filter((pos) => pos.category === category)
      .length;
  };

  const tabs = [
    { id: "SIC", label: "SIC Leadership", icon: Crown },
    { id: "Band", label: "Band Leadership", icon: Music },
    { id: "Department", label: "Department Leadership", icon: Grid3x3 },
    { id: "Unit", label: "Unit Leadership", icon: Briefcase },
    { id: "Class", label: "Class Leadership", icon: GraduationCap },
    { id: "Committee", label: "Committee Leadership", icon: UsersRound },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#009AF4]/10 flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#009AF4]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#222B45]">
                Leadership Consolidation
              </h1>
              <p className="text-[#8F9BB3] mt-1">
                Central governance and leadership structure
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
            onClick={() => setShowCreateEditModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Leadership Role
          </Button>
          <Button
            className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            onClick={() => setShowAssignModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Assign New Leader
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">
                  Total Active Leaders
                </p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {totalActiveLeaders}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+5 this month</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">
                  Roles Expiring Soon
                </p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {rolesDueSoon}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-orange-600" />
                  <span className="text-xs text-orange-600">
                    Within 90 days
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Vacant Positions</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {vacantPositions}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Minus className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-600">
                    Needs assignment
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center">
                <UserX className="w-7 h-7 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Expired Positions</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {expiredPositions}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600">Requires renewal</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-[#EDF1F7] shadow-sm">
        {/* Tabs */}
        <div className="border-b border-[#EDF1F7] overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = getCategoryCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-[#009AF4] text-[#009AF4] bg-[#009AF4]/5"
                      : "border-transparent text-[#8F9BB3] hover:text-[#222B45] hover:bg-[#F7F9FC]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <Badge
                    variant="outline"
                    className={
                      isActive
                        ? "bg-[#009AF4] text-white border-[#009AF4]"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  >
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
              <input
                type="text"
                placeholder="Search by role, member, or context..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Due">Due Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Leadership Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Assigned Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Scope
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredPositions.map((position) => (
                  <tr
                    key={position.id}
                    className="hover:bg-[#F7F9FC] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                          {getCategoryIcon(position.category)}
                        </div>
                        <div>
                          <p className="font-medium text-[#222B45]">
                            {position.roleName}
                          </p>
                          {position.context && (
                            <p className="text-xs text-[#8F9BB3] mt-0.5">
                              {position.context}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {position.assignedMember ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#009AF4]/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-[#009AF4]" />
                          </div>
                          <span className="text-sm text-[#222B45]">
                            {position.assignedMember}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#8F9BB3] italic">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={
                          position.scope === "Global"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {position.scope}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {position.startDate ? (
                        <div className="flex items-center gap-2 text-sm text-[#222B45]">
                          <Calendar className="w-3.5 h-3.5 text-[#8F9BB3]" />
                          {new Date(position.startDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-[#8F9BB3]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {position.endDate ? (
                        <div>
                          <div className="flex items-center gap-2 text-sm text-[#222B45]">
                            <Calendar className="w-3.5 h-3.5 text-[#8F9BB3]" />
                            {new Date(position.endDate).toLocaleDateString()}
                          </div>
                          {position.daysUntilExpiry !== null &&
                            position.daysUntilExpiry > 0 &&
                            position.daysUntilExpiry <= 90 && (
                              <p className="text-xs text-orange-600 mt-1">
                                {position.daysUntilExpiry} days left
                              </p>
                            )}
                          {position.daysUntilExpiry !== null &&
                            position.daysUntilExpiry < 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                Expired {Math.abs(position.daysUntilExpiry)}{" "}
                                days ago
                              </p>
                            )}
                        </div>
                      ) : (
                        <span className="text-sm text-[#8F9BB3]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={getStatusBadgeColor(position.status)}
                      >
                        {getStatusIcon(position.status)}
                        <span className="ml-1">{position.status}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === position.id ? null : position.id,
                              )
                            }
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {openMenuId === position.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#EDF1F7] py-1 z-20">
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedPosition(position);
                                    setShowViewDetailsModal(true);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedPosition(position);
                                    setShowAssignModal(true);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Assignment
                                </button>
                                {position.status === "Vacant" && (
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-[#009AF4] hover:bg-[#F7F9FC] flex items-center gap-2"
                                    onClick={() => {
                                      setSelectedPosition(position);
                                      setShowAssignModal(true);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <UserPlus className="w-4 h-4" />
                                    Assign Leader
                                  </button>
                                )}
                                {(position.status === "Expired" ||
                                  position.status === "Due") && (
                                  <button
                                    className="w-full px-4 py-2 text-left text-sm text-[#009AF4] hover:bg-[#F7F9FC] flex items-center gap-2"
                                    onClick={() => {
                                      setSelectedPosition(position);
                                      setShowAssignModal(true);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <Clock className="w-4 h-4" />
                                    Renew Term
                                  </button>
                                )}
                                <div className="border-t border-[#EDF1F7] my-1" />
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Are you sure you want to remove this role?",
                                      )
                                    ) {
                                      alert("Role removed successfully!");
                                      setOpenMenuId(null);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove Role
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPositions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-[#F7F9FC] rounded-full flex items-center justify-center mb-4">
                {getCategoryIcon(activeTab)}
              </div>
              <h3 className="font-semibold text-[#222B45] mb-2">
                No leadership positions found
              </h3>
              <p className="text-sm text-[#8F9BB3] mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : `No ${activeTab} leadership positions have been created yet`}
              </p>
              <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Leadership Role
              </Button>
            </div>
          )}

          {/* Results Count */}
          {filteredPositions.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-[#8F9BB3]">
              <p>
                Showing{" "}
                <span className="font-medium text-[#222B45]">
                  {filteredPositions.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#222B45]">
                  {filteredByTab.length}
                </span>{" "}
                positions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Leadership Role Modal */}
      <CreateEditLeadershipRoleModal
        isOpen={showCreateEditModal}
        onClose={() => setShowCreateEditModal(false)}
        // selectedPosition={selectedPosition}
        onSave={(position) => {
          // Handle saving the position
          console.log("Saved position:", position);
          setShowCreateEditModal(false);
        }}
      />

      {/* Assign Leadership Role Modal */}
      <AssignLeadershipRoleModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        // selectedPosition={selectedPosition}
        // onSave={(position) => {
        //   // Handle assigning the position
        //   console.log("Assigned position:", position);
        //   setShowAssignModal(false);
        // }}
      />

      {/* View Leadership Details Modal */}
      <ViewLeadershipDetailsModal
        isOpen={showViewDetailsModal}
        onClose={() => {
          setShowViewDetailsModal(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition}
        onEdit={() => {
          setShowViewDetailsModal(false);
          setShowAssignModal(true);
        }}
      />
    </div>
  );
}
