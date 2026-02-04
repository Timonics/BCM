"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditBandModal from "@/components/modal/edit-band";
import AssignBandModal from "@/components/modal/assign-band-modal";
import {
  ArrowLeft,
  Music,
  Users,
  Crown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Edit,
  UserPlus,
  FileDown,
  Mail,
  Phone,
  Cake,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Clock,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  CircleAlert,
  BellRing,
  Settings,
  Search,
} from "lucide-react";

interface BandDetailPageProps {
  bandId?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onAddMember?: () => void;
  onViewMember?: (memberId: string) => void;
}

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

export default function BandDetailPage({
  bandId,
  onBack,
  onEdit,
  onAddMember,
  onViewMember,
}: BandDetailPageProps) {
  const [showLeadership, setShowLeadership] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isEditBandModalOpen, setIsEditBandModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Mock band data
  const band = {
    id: "youth",
    name: "Youth Band",
    genderType: "Mixed",
    minAge: 13,
    maxAge: 25,
    membersCount: 68,
    activeMembers: 65,
    capacity: 80,
    coordinator: "Brother John Smith",
    description:
      "Youth Band serves young adults aged 13-25, focusing on spiritual growth, leadership development, and active participation in church activities.",
    founded: "2010-01-15",
    meetingDay: "Sunday",
    meetingTime: "9:00 AM",
    trend: "up",
  };

  // Mock leadership data
  const leaders: Leader[] = [
    {
      id: "L001",
      name: "Brother John Smith",
      role: "Band Coordinator",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 366,
      email: "john.smith@church.org",
      phone: "+1 234-567-8901",
    },
    {
      id: "L002",
      name: "Sister Emily Davis",
      role: "Secretary",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 366,
      email: "emily.davis@church.org",
      phone: "+1 234-567-8902",
    },
    {
      id: "L003",
      name: "Brother Michael Chen",
      role: "Treasurer",
      startDate: "2023-01-01",
      endDate: "2025-01-15",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 16,
      email: "michael.chen@church.org",
      phone: "+1 234-567-8903",
    },
    {
      id: "L004",
      name: "Sister Grace Wilson",
      role: "Welfare Officer",
      startDate: "2022-06-01",
      endDate: "2024-12-20",
      isActive: false,
      isExpired: true,
      daysUntilExpiry: -10,
      email: "grace.wilson@church.org",
      phone: "+1 234-567-8904",
    },
    {
      id: "L005",
      name: "Brother David Lee",
      role: "Protocol Officer",
      startDate: "2024-06-01",
      endDate: "2025-01-10",
      isActive: true,
      isExpired: false,
      daysUntilExpiry: 11,
      email: "david.lee@church.org",
      phone: "+1 234-567-8905",
    },
  ];

  // Mock members data
  const allMembers: Member[] = [
    {
      id: "BCM1001",
      name: "Sarah Johnson",
      gender: "Female",
      age: 19,
      dateOfBirth: "2006-03-15",
      joinDate: "2022-01-10",
      status: "Active",
      alerts: [],
      email: "sarah.j@email.com",
      phone: "+1 234-567-1001",
      attendance: 95,
    },
    {
      id: "BCM1002",
      name: "James Wilson",
      gender: "Male",
      age: 22,
      dateOfBirth: "2003-07-22",
      joinDate: "2021-06-15",
      status: "Active",
      alerts: [],
      email: "james.w@email.com",
      phone: "+1 234-567-1002",
      attendance: 88,
    },
    {
      id: "BCM1003",
      name: "Emma Brown",
      gender: "Female",
      age: 26,
      dateOfBirth: "1999-11-08",
      joinDate: "2018-03-20",
      status: "Active",
      alerts: ["overgrown"],
      email: "emma.b@email.com",
      phone: "+1 234-567-1003",
      attendance: 92,
    },
    {
      id: "BCM1004",
      name: "Michael Davis",
      gender: "Male",
      age: 27,
      dateOfBirth: "1998-05-14",
      joinDate: "2017-09-12",
      status: "Active",
      alerts: ["overgrown"],
      email: "michael.d@email.com",
      phone: "+1 234-567-1004",
      attendance: 78,
    },
    {
      id: "BCM1005",
      name: "Olivia Martinez",
      gender: "Female",
      age: 18,
      dateOfBirth: "2007-02-28",
      joinDate: "2023-01-05",
      status: "Active",
      alerts: [],
      email: "olivia.m@email.com",
      phone: "+1 234-567-1005",
      attendance: 97,
    },
    {
      id: "BCM1006",
      name: "Daniel Taylor",
      gender: "Male",
      age: 20,
      dateOfBirth: "2005-09-19",
      joinDate: "2022-08-01",
      status: "Active",
      alerts: [],
      email: "daniel.t@email.com",
      phone: "+1 234-567-1006",
      attendance: 85,
    },
    {
      id: "BCM1007",
      name: "Sophia Anderson",
      gender: "Female",
      age: 16,
      dateOfBirth: "2009-12-03",
      joinDate: "2024-02-14",
      status: "Active",
      alerts: [],
      email: "sophia.a@email.com",
      phone: "+1 234-567-1007",
      attendance: 91,
    },
    {
      id: "BCM1008",
      name: "Joshua Thomas",
      gender: "Male",
      age: 24,
      dateOfBirth: "2001-04-07",
      joinDate: "2020-11-18",
      status: "Inactive",
      alerts: [],
      email: "joshua.t@email.com",
      phone: "+1 234-567-1008",
      attendance: 45,
    },
  ];

  // Filter members
  const filteredMembers = allMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getExpiryIndicator = (leader: Leader) => {
    if (leader.isExpired) {
      return {
        icon: <BellRing className="w-4 h-4 text-red-600" />,
        color: "bg-red-50 text-red-700 border-red-200",
        text: "Expired",
      };
    }

    if (leader.daysUntilExpiry !== null) {
      if (leader.daysUntilExpiry <= 7) {
        return {
          icon: <BellRing className="w-4 h-4 text-red-600 animate-pulse" />,
          color: "bg-red-50 text-red-700 border-red-200",
          text: `${leader.daysUntilExpiry} days left`,
        };
      } else if (leader.daysUntilExpiry <= 30) {
        return {
          icon: <CircleAlert className="w-4 h-4 text-orange-600" />,
          color: "bg-orange-50 text-orange-700 border-orange-200",
          text: `${leader.daysUntilExpiry} days left`,
        };
      } else if (leader.daysUntilExpiry <= 90) {
        return {
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          text: `${Math.floor(leader.daysUntilExpiry / 30)} months left`,
        };
      }
    }

    return {
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      color: "bg-green-50 text-green-700 border-green-200",
      text: "Active",
    };
  };

  const getTrendIcon = () => {
    switch (band.trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Suspended":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-[#222B45]">
              {band.name}
            </h2>
            <p className="text-[#8F9BB3] mt-1">
              Band details, leadership, and members
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#EDF1F7]"
            onClick={() => setIsEditBandModalOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Band
          </Button>
          <Button
            className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Band Info and Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Band Info */}
        <Card className="lg:col-span-2 border-[#EDF1F7] shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#009AF4]" />
                </div>
                <CardTitle>Band Information</CardTitle>
              </div>
              {getTrendIcon()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#8F9BB3]">{band.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EDF1F7]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-[#8F9BB3]">Gender Type</p>
                  <p className="font-medium text-[#222B45]">
                    {band.genderType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Cake className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-[#8F9BB3]">Age Bracket</p>
                  <p className="font-medium text-[#222B45]">
                    {band.minAge} - {band.maxAge === 100 ? "∞" : band.maxAge}{" "}
                    years
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-[#8F9BB3]">Coordinator</p>
                  <p className="font-medium text-[#222B45]">
                    {band.coordinator}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-[#8F9BB3]">Founded</p>
                  <p className="font-medium text-[#222B45]">
                    {new Date(band.founded).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#009AF4]" />
                </div>
                <div>
                  <p className="text-xs text-[#8F9BB3]">Meeting Schedule</p>
                  <p className="font-medium text-[#222B45]">
                    {band.meetingDay}s at {band.meetingTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#009AF4]" />
                </div>
                <div>
                  <p className="text-xs text-[#8F9BB3]">Members</p>
                  <p className="font-medium text-[#222B45]">
                    {band.membersCount} / {band.capacity}
                  </p>
                  <div className="w-32 bg-[#EDF1F7] rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        (band.membersCount / band.capacity) * 100 > 90
                          ? "bg-red-500"
                          : (band.membersCount / band.capacity) * 100 > 70
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${(band.membersCount / band.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#009AF4]" />
              <CardTitle>Band Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex items-start gap-2 mb-2">
                  <Cake className="w-4 h-4 text-[#009AF4] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#222B45]">
                      Age Requirement
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Members must be between {band.minAge} and{" "}
                      {band.maxAge === 100 ? "∞" : band.maxAge} years old
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex items-start gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#009AF4] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#222B45]">
                      Gender Policy
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      {band.genderType === "Mixed"
                        ? "Open to all genders"
                        : `${band.genderType} members only`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#009AF4] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#222B45]">
                      Capacity Limit
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Maximum {band.capacity} members
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Current:{" "}
                      {Math.round((band.membersCount / band.capacity) * 100)}%
                      full
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-orange-900">
                      Overgrown Alert
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Members exceeding the age limit should be transferred to
                      an appropriate band
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leadership Section - Accordion */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <button
            onClick={() => setShowLeadership(!showLeadership)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Crown className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Leadership Team</CardTitle>
                <p className="text-sm text-[#8F9BB3] mt-1">
                  {leaders.filter((l) => l.isActive).length} active positions
                </p>
              </div>
            </div>
            {showLeadership ? (
              <ChevronUp className="w-5 h-5 text-[#8F9BB3]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#8F9BB3]" />
            )}
          </button>
        </CardHeader>

        {showLeadership && (
          <CardContent>
            <div className="space-y-3">
              {leaders.map((leader) => {
                const expiryIndicator = getExpiryIndicator(leader);
                return (
                  <div
                    key={leader.id}
                    className={`p-4 rounded-lg border transition-all ${
                      leader.isExpired
                        ? "bg-red-50 border-red-200"
                        : "bg-[#F7F9FC] border-[#EDF1F7] hover:border-[#009AF4]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            leader.isExpired ? "bg-red-100" : "bg-[#009AF4]"
                          }`}
                        >
                          <span
                            className={`font-semibold ${
                              leader.isExpired ? "text-red-700" : "text-white"
                            }`}
                          >
                            {leader.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#222B45]">
                              {leader.name}
                            </h4>
                            {leader.isExpired && (
                              <BellRing className="w-4 h-4 text-red-600 animate-pulse" />
                            )}
                          </div>
                          <p className="text-sm text-[#8F9BB3] mb-2">
                            {leader.role}
                          </p>

                          <div className="flex flex-wrap gap-3 text-xs text-[#8F9BB3]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(leader.startDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" },
                                )}
                                {" - "}
                                {new Date(leader.endDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" },
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{leader.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{leader.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={expiryIndicator.color}
                        >
                          {expiryIndicator.icon}
                          <span className="ml-1">{expiryIndicator.text}</span>
                        </Badge>
                      </div>
                    </div>

                    {leader.isExpired && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-700">
                            This leadership position has expired and requires
                            renewal or replacement
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Members Section */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#009AF4]" />
              </div>
              <div>
                <CardTitle>Band Members</CardTitle>
                <p className="text-sm text-[#8F9BB3] mt-1">
                  {filteredMembers.length} of {allMembers.length} members
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-[#EDF1F7]">
              <FileDown className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-[#F7F9FC] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009AF4] flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#222B45]">
                            {member.name}
                          </p>
                          <p className="text-xs text-[#8F9BB3]">{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">
                        {member.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">
                        {member.age} years
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">
                        {new Date(member.joinDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${getAttendanceColor(member.attendance)}`}
                      >
                        {member.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={getStatusColor(member.status)}
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {member.alerts.includes("overgrown") ? (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Overgrown
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Normal
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewMember?.(member.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-[#F7F9FC] rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#8F9BB3]" />
              </div>
              <h3 className="font-semibold text-[#222B45] mb-2">
                No members found
              </h3>
              <p className="text-sm text-[#8F9BB3]">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No members in this band yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Band Modal */}
      <EditBandModal
        isOpen={isEditBandModalOpen}
        onClose={() => setIsEditBandModalOpen(false)}
      />

      {/* Add Member Modal */}
      <AssignBandModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
}
