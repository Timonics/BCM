"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddNewDepartmentModal from "@/components/modal/add-department";
import EditDepartmentModal from "@/components/modal/edit-department";
import Toast from "@/components/Toast";
import {
  Search,
  Filter,
  Briefcase,
  Users,
  UserPlus,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle,
  List,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  CircleAlert,
  Grid3x3,
  LayoutGrid,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  category: "Ministry" | "Administrative" | "Support" | "Outreach";
  membersCount: number;
  activeMembers: number;
  unitsCount: number;
  headOfDepartment: string;
  description: string;
  leadershipAlerts: number;
  status: "Active" | "Inactive";
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}
import { useRouter } from "next/navigation";
import router from "next/dist/shared/lib/router/router";

export default function DepartmentsListScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    alerts: "all",
  });
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] =
    useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] =
    useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleOpenEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditDepartmentModalOpen(true);
  };

  // Mock departments data
  const departments: Department[] = [
    {
      id: "children",
      name: "Children's Department",
      category: "Ministry",
      membersCount: 156,
      activeMembers: 142,
      unitsCount: 5,
      headOfDepartment: "Sister Grace Thompson",
      description: "Ministry to children from ages 0-12",
      leadershipAlerts: 2,
      status: "Active",
      trend: "up",
      lastUpdated: "2026-01-28",
    },
    {
      id: "youth",
      name: "Youth Department",
      category: "Ministry",
      membersCount: 234,
      activeMembers: 218,
      unitsCount: 7,
      headOfDepartment: "Brother Michael Johnson",
      description: "Ministry to teenagers and young adults",
      leadershipAlerts: 0,
      status: "Active",
      trend: "up",
      lastUpdated: "2026-01-30",
    },
    {
      id: "adult",
      name: "Adult Department",
      category: "Ministry",
      membersCount: 412,
      activeMembers: 389,
      unitsCount: 10,
      headOfDepartment: "Brother David Williams",
      description: "Ministry to adult members",
      leadershipAlerts: 1,
      status: "Active",
      trend: "stable",
      lastUpdated: "2026-01-29",
    },
    {
      id: "administration",
      name: "Administration Department",
      category: "Administrative",
      membersCount: 45,
      activeMembers: 43,
      unitsCount: 4,
      headOfDepartment: "Sister Patricia Brown",
      description: "Church administrative functions",
      leadershipAlerts: 0,
      status: "Active",
      trend: "stable",
      lastUpdated: "2026-01-31",
    },
    {
      id: "music",
      name: "Music Department",
      category: "Ministry",
      membersCount: 89,
      activeMembers: 82,
      unitsCount: 6,
      headOfDepartment: "Brother James Wilson",
      description: "All music and worship ministries",
      leadershipAlerts: 3,
      status: "Active",
      trend: "up",
      lastUpdated: "2026-01-27",
    },
    {
      id: "outreach",
      name: "Outreach Department",
      category: "Outreach",
      membersCount: 67,
      activeMembers: 61,
      unitsCount: 5,
      headOfDepartment: "Sister Mary Davis",
      description: "Evangelism and community outreach",
      leadershipAlerts: 1,
      status: "Active",
      trend: "down",
      lastUpdated: "2026-01-26",
    },
  ];

  // Filter departments based on search and filters
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.headOfDepartment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "all" || dept.category === filters.category;
    const matchesStatus =
      filters.status === "all" || dept.status === filters.status;
    const matchesAlerts =
      filters.alerts === "all" ||
      (filters.alerts === "with" && dept.leadershipAlerts > 0) ||
      (filters.alerts === "without" && dept.leadershipAlerts === 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesAlerts;
  });

  // Statistics
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(
    (d) => d.status === "Active",
  ).length;
  const totalMembers = departments.reduce((sum, d) => sum + d.membersCount, 0);
  const totalUnits = departments.reduce((sum, d) => sum + d.unitsCount, 0);
  const departmentsWithAlerts = departments.filter(
    (d) => d.leadershipAlerts > 0,
  ).length;

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down")
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-7 h-7 text-purple-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[#222B45] mb-2">
              Departments
            </h1>
            <p className="text-[#8F9BB3]">Manage departments and their units</p>
          </div>
        </div>

        <Button
          className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
          onClick={() => setIsAddDepartmentModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Total Departments</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {totalDepartments}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Active</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {activeDepartments}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Total Units</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {totalUnits}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Total Members</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {totalMembers}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">With Alerts</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {departmentsWithAlerts}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F9BB3]" />
              <input
                type="text"
                placeholder="Search departments or heads..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={`border-[#EDF1F7] ${showFilters ? "bg-[#F7F9FC]" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className="flex items-center gap-1 bg-[#F7F9FC] p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded ${
                    viewMode === "cards"
                      ? "bg-white shadow-sm text-[#009AF4]"
                      : "text-[#8F9BB3]"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-[#009AF4]"
                      : "text-[#8F9BB3]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#EDF1F7]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-[#8F9BB3] mb-2 block">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                  >
                    <option value="all">All Categories</option>
                    <option value="Ministry">Ministry</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Support">Support</option>
                    <option value="Outreach">Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-[#8F9BB3] mb-2 block">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-[#8F9BB3] mb-2 block">
                    Leadership Alerts
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                    value={filters.alerts}
                    onChange={(e) =>
                      setFilters({ ...filters, alerts: e.target.value })
                    }
                  >
                    <option value="all">All</option>
                    <option value="with">With Alerts</option>
                    <option value="without">Without Alerts</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#8F9BB3]">
          Showing{" "}
          <span className="font-semibold text-[#222B45]">
            {filteredDepartments.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#222B45]">
            {totalDepartments}
          </span>{" "}
          departments
        </p>
      </div>

      {/* Departments Grid/Table */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <Card
              key={dept.id}
              className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(dept.trend)}
                    <Badge
                      variant={
                        dept.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        dept.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {dept.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-lg text-[#222B45]">
                    {dept.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {dept.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-[#8F9BB3] line-clamp-2">
                  {dept.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8F9BB3]" />
                    <div>
                      <p className="text-xs text-[#8F9BB3]">Members</p>
                      <p className="font-semibold text-[#222B45]">
                        {dept.membersCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-[#8F9BB3]" />
                    <div>
                      <p className="text-xs text-[#8F9BB3]">Units</p>
                      <p className="font-semibold text-[#222B45]">
                        {dept.unitsCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EDF1F7]">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-[#222B45]">
                      {dept.headOfDepartment}
                    </span>
                  </div>

                  {dept.leadershipAlerts > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                      <CircleAlert className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-700">
                        {dept.leadershipAlerts} leadership{" "}
                        {dept.leadershipAlerts === 1 ? "alert" : "alerts"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#EDF1F7] hover:bg-[#F7F9FC]"
                      onClick={() =>
                        router.push(`/dashboard/departments/${dept.id}`)
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#EDF1F7] hover:bg-[#F7F9FC]"
                      onClick={() =>
                        router.push(`/dashboard/departments/${dept.id}/edit`)
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Head
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#EDF1F7]">
                  {filteredDepartments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-[#F7F9FC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#222B45]">
                              {dept.name}
                            </p>
                            {dept.leadershipAlerts > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <CircleAlert className="w-3 h-3 text-orange-600" />
                                <span className="text-xs text-orange-700">
                                  {dept.leadershipAlerts}{" "}
                                  {dept.leadershipAlerts === 1
                                    ? "alert"
                                    : "alerts"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-[#222B45]">
                            {dept.headOfDepartment}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {dept.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Grid3x3 className="w-4 h-4 text-[#8F9BB3]" />
                          <span className="font-semibold text-[#222B45]">
                            {dept.unitsCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#8F9BB3]" />
                          <span className="font-semibold text-[#222B45]">
                            {dept.membersCount}
                          </span>
                          <span className="text-xs text-[#8F9BB3]">
                            ({dept.activeMembers} active)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              dept.status === "Active" ? "default" : "secondary"
                            }
                            className={
                              dept.status === "Active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {dept.status}
                          </Badge>
                          {getTrendIcon(dept.trend)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#EDF1F7]"
                            onClick={() =>
                              router.push(`/dashboard/departments/${dept.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#EDF1F7]"
                            onClick={() => handleOpenEditModal(dept)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {isAddDepartmentModalOpen && <AddNewDepartmentModal />}

      {isEditDepartmentModalOpen && selectedDepartment && (
        <EditDepartmentModal />
      )}

      {/* Toast */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
