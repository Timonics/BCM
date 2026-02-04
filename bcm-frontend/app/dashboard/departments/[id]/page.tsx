"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Crown,
  Calendar,
  Edit,
  UserPlus,
  FileDown,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  TrendingUp,
  Eye,
  CircleAlert,
  Settings,
  Search,
  Grid3x3,
  Plus,
} from "lucide-react";

interface Leader {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isExpired: boolean;
  daysUntilExpiry: number | null;
  email: string;
  phone: string;
}

interface Member {
  id: string;
  name: string;
  gender: "Male" | "Female";
  age: number;
  dateOfBirth: string;
  joinDate: string;
  status: "Active" | "Inactive" | "Suspended";
  alerts: string[];
  email: string;
  phone: string;
  attendance: number;
}

interface Unit {
  id: string;
  name: string;
  coordinator: string;
  membersCount: number;
  status: "Active" | "Inactive";
  leadershipAlerts: number;
}

export default function DepartmentDetailScreen() {
  const router = useRouter();
  const [expandedLeadership, setExpandedLeadership] = useState<string[]>([
    "head",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "units" | "members" | "leadership"
  >("overview");

  const onBack = () => {
    router.back();
  };
  const onEdit = () => {
    router.push("/dashboard/departments/edit");
  };
  const onAddMember = () => {
    router.push("/dashboard/members/add");
  };
  const onAddUnit = () => {
    router.push("/dashboard/units/add");
  };
  const onViewUnit = (unitId: string) => {
    router.push(`/dashboard/units/${unitId}`);
  };
  const onViewMember = (memberId: string) => {
    router.push(`/dashboard/members/${memberId}`);
  };

  // Mock department data
  const department = {
    id: "youth",
    name: "Youth Department",
    category: "Ministry",
    membersCount: 234,
    activeMembers: 218,
    unitsCount: 7,
    headOfDepartment: "Brother Michael Johnson",
    description:
      "The Youth Department ministers to teenagers and young adults, equipping them for leadership and service. We provide discipleship, mentorship, and opportunities for spiritual growth.",
    founded: "2005-06-15",
    meetingDay: "Saturday",
    meetingTime: "3:00 PM",
    trend: "up",
    status: "Active",
  };

  // Mock leadership data
  const leaders: Leader[] = [
    {
      id: "l1",
      name: "Brother Michael Johnson",
      role: "Head of Department",
      startDate: "2023-01-15",
      endDate: "2026-01-15",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 14,
      email: "michael.johnson@bcm.org",
      phone: "+1 (555) 234-5678",
    },
    {
      id: "l2",
      name: "Sister Jennifer White",
      role: "Assistant Head",
      startDate: "2023-06-01",
      endDate: "2026-06-01",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 151,
      email: "jennifer.white@bcm.org",
      phone: "+1 (555) 345-6789",
    },
    {
      id: "l3",
      name: "Brother David Martinez",
      role: "Youth Coordinator",
      startDate: "2024-01-01",
      endDate: "2027-01-01",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 334,
      email: "david.martinez@bcm.org",
      phone: "+1 (555) 456-7890",
    },
  ];

  // Mock units data
  const units: Unit[] = [
    {
      id: "u1",
      name: "Teen Ministry Unit",
      coordinator: "Sister Sarah Wilson",
      membersCount: 45,
      status: "Active",
      leadershipAlerts: 0,
    },
    {
      id: "u2",
      name: "Young Adults Unit",
      coordinator: "Brother James Brown",
      membersCount: 52,
      status: "Active",
      leadershipAlerts: 1,
    },
    {
      id: "u3",
      name: "Youth Worship Unit",
      coordinator: "Sister Rachel Green",
      membersCount: 38,
      status: "Active",
      leadershipAlerts: 0,
    },
    {
      id: "u4",
      name: "Youth Outreach Unit",
      coordinator: "Brother Mark Taylor",
      membersCount: 29,
      status: "Active",
      leadershipAlerts: 0,
    },
    {
      id: "u5",
      name: "Discipleship Unit",
      coordinator: "Sister Lisa Anderson",
      membersCount: 34,
      status: "Active",
      leadershipAlerts: 1,
    },
    {
      id: "u6",
      name: "Media & Tech Unit",
      coordinator: "Brother Chris Moore",
      membersCount: 21,
      status: "Active",
      leadershipAlerts: 0,
    },
    {
      id: "u7",
      name: "Sports Ministry Unit",
      coordinator: "Brother Kevin Lee",
      membersCount: 15,
      status: "Active",
      leadershipAlerts: 0,
    },
  ];

  // Mock members data
  const members: Member[] = [
    {
      id: "m1",
      name: "Emily Johnson",
      gender: "Female",
      age: 19,
      dateOfBirth: "2007-03-15",
      joinDate: "2020-01-10",
      status: "Active",
      alerts: [],
      email: "emily.johnson@email.com",
      phone: "+1 (555) 111-2222",
      attendance: 92,
    },
    {
      id: "m2",
      name: "Joshua Williams",
      gender: "Male",
      age: 21,
      dateOfBirth: "2005-07-22",
      joinDate: "2018-05-15",
      status: "Active",
      alerts: [],
      email: "joshua.williams@email.com",
      phone: "+1 (555) 222-3333",
      attendance: 88,
    },
    {
      id: "m3",
      name: "Sarah Martinez",
      gender: "Female",
      age: 18,
      dateOfBirth: "2008-11-08",
      joinDate: "2021-03-20",
      status: "Active",
      alerts: [],
      email: "sarah.martinez@email.com",
      phone: "+1 (555) 333-4444",
      attendance: 95,
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleLeadership = (roleId: string) => {
    setExpandedLeadership((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const getLeadershipStatus = (leader: Leader) => {
    if (!leader.isActive)
      return {
        label: "Inactive",
        color: "bg-gray-50 text-gray-700 border-gray-200",
      };
    if (leader.isExpired)
      return {
        label: "Expired",
        color: "bg-red-50 text-red-700 border-red-200",
      };
    if (leader.daysUntilExpiry && leader.daysUntilExpiry <= 30)
      return {
        label: `Expires in ${leader.daysUntilExpiry}d`,
        color: "bg-orange-50 text-orange-700 border-orange-200",
      };
    return {
      label: "Active",
      color: "bg-green-50 text-green-700 border-green-200",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" className="p-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
            <Briefcase className="w-7 h-7 text-purple-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-[#222B45]">
                {department.name}
              </h1>
              <Badge
                variant="default"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {department.status}
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200"
              >
                {department.category}
              </Badge>
            </div>
            <p className="text-[#8F9BB3]">{department.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#EDF1F7]"
            onClick={onAddMember}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button
            variant="outline"
            className="border-[#EDF1F7]"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Total Members</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {department.membersCount}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {department.activeMembers} active
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Units</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {department.unitsCount}
                </p>
                <p className="text-xs text-[#8F9BB3] mt-1">Max: 10 units</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Leadership</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {leaders.length}
                </p>
                <p className="text-xs text-[#8F9BB3] mt-1">Active leaders</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#8F9BB3] mb-1">Founded</p>
                <p className="text-xl font-semibold text-[#222B45]">
                  {new Date(department.founded).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-[#8F9BB3] mt-1">
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(department.founded).getTime()) /
                      (1000 * 60 * 60 * 24 * 365),
                  )}{" "}
                  years ago
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center border-b border-[#EDF1F7] overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-[#009AF4] text-[#009AF4]"
                  : "border-transparent text-[#8F9BB3] hover:text-[#222B45]"
              }`}
            >
              <Info className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("units")}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "units"
                  ? "border-[#009AF4] text-[#009AF4]"
                  : "border-transparent text-[#8F9BB3] hover:text-[#222B45]"
              }`}
            >
              <Grid3x3 className="w-4 h-4 inline mr-2" />
              Units ({units.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "members"
                  ? "border-[#009AF4] text-[#009AF4]"
                  : "border-transparent text-[#8F9BB3] hover:text-[#222B45]"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("leadership")}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === "leadership"
                  ? "border-[#009AF4] text-[#009AF4]"
                  : "border-transparent text-[#8F9BB3] hover:text-[#222B45]"
              }`}
            >
              <Crown className="w-4 h-4 inline mr-2" />
              Leadership ({leaders.length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-[#EDF1F7] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-[#222B45]">
                Department Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8F9BB3] mb-1">
                    Meeting Schedule
                  </p>
                  <p className="font-semibold text-[#222B45]">
                    {department.meetingDay}s at {department.meetingTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#8F9BB3] mb-1">
                    Head of Department
                  </p>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <p className="font-semibold text-[#222B45]">
                      {department.headOfDepartment}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDF1F7]">
                <p className="text-sm text-[#8F9BB3] mb-2">Description</p>
                <p className="text-[#222B45]">{department.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#EDF1F7] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-[#222B45]">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-[#EDF1F7] hover:bg-[#F7F9FC]"
                onClick={onAddUnit}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Unit
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-[#EDF1F7] hover:bg-[#F7F9FC]"
                onClick={onAddMember}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-[#EDF1F7] hover:bg-[#F7F9FC]"
              >
                <Crown className="w-4 h-4 mr-2" />
                Manage Leadership
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-[#EDF1F7] hover:bg-[#F7F9FC]"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-[#EDF1F7] hover:bg-[#F7F9FC]"
                onClick={onEdit}
              >
                <Settings className="w-4 h-4 mr-2" />
                Department Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Units Tab */}
      {activeTab === "units" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#8F9BB3]">
              {units.length} of 10 units created
            </p>
            <Button
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              onClick={onAddUnit}
              disabled={units.length >= 10}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => (
              <Card
                key={unit.id}
                className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Grid3x3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {unit.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-[#222B45]">
                    {unit.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-[#222B45]">{unit.coordinator}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-[#222B45]">
                      {unit.membersCount} members
                    </span>
                  </div>

                  {unit.leadershipAlerts > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <CircleAlert className="w-4 h-4 text-orange-600" />
                      <span className="text-xs text-orange-700">
                        {unit.leadershipAlerts}{" "}
                        {unit.leadershipAlerts === 1 ? "alert" : "alerts"}
                      </span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-[#EDF1F7] hover:bg-[#F7F9FC]"
                    onClick={() => onViewUnit?.(unit.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <Card className="border-[#EDF1F7] shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F9BB3]" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <Card className="border-[#EDF1F7] shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#8F9BB3] uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF1F7]">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-[#F7F9FC]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#222B45]">
                                {member.name}
                              </p>
                              <p className="text-xs text-[#8F9BB3]">
                                {member.gender}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#222B45]">
                          {member.age}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-[#8F9BB3]">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#8F9BB3]">
                              <Phone className="w-3 h-3" />
                              {member.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${member.attendance}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-[#222B45]">
                              {member.attendance}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="default"
                            className={
                              member.status === "Active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : member.status === "Inactive"
                                  ? "bg-gray-50 text-gray-700 border-gray-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {member.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#EDF1F7]"
                            onClick={() => onViewMember?.(member.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leadership Tab */}
      {activeTab === "leadership" && (
        <div className="space-y-4">
          {leaders.map((leader) => {
            const status = getLeadershipStatus(leader);
            const isExpanded = expandedLeadership.includes(leader.id);

            return (
              <Card key={leader.id} className="border-[#EDF1F7] shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-[#222B45]">
                            {leader.name}
                          </h3>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#8F9BB3]">{leader.role}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLeadership(leader.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="border-t border-[#EDF1F7] pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#8F9BB3] mb-2">
                          Tenure Period
                        </p>
                        <div className="flex items-center gap-2 text-sm text-[#222B45]">
                          <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                          {new Date(
                            leader.startDate,
                          ).toLocaleDateString()} -{" "}
                          {new Date(leader.endDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-[#8F9BB3] mb-2">
                          Contact Information
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-[#222B45]">
                            <Mail className="w-4 h-4 text-[#8F9BB3]" />
                            {leader.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#222B45]">
                            <Phone className="w-4 h-4 text-[#8F9BB3]" />
                            {leader.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
