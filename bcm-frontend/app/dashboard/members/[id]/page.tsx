"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AssignBandModal from "@/components/modal/assign-band-modal";
import AssignLeadershipRoleModal from "@/components/modal/assign-leadership-role";
import TransferMemberModal from "@/components/modal/transfer-member-modal";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Cake,
  User,
  Users,
  Music,
  Crown,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Edit,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  Award,
  UserPlus,
  UserX,
  Shield,
  ArrowRightLeft,
} from "lucide-react";

interface MemberProfilePageProps {
  memberId?: string;
  onBack?: () => void;
  onEdit?: () => void;
}

export default function MemberProfilePage({
  memberId = "BCM1004",
  onBack,
  onEdit,
}: MemberProfilePageProps) {
  const [activeTab, setActiveTab] = useState("bands");
  const [isAssignBandModalOpen, setIsAssignBandModalOpen] = useState(false);
  const [isAssignLeadershipRoleModalOpen, setIsAssignLeadershipRoleModalOpen] =
    useState(false);
  const [isTransferMemberModalOpen, setIsTransferMemberModalOpen] =
    useState(false);

  // Mock member data
  const memberData = {
    id: memberId,
    firstName: "James",
    middleName: "Emmanuel",
    surname: "Wilson",
    email: "james.wilson@email.com",
    phone: "+234 803 456 7890",
    gender: "Male",
    dateOfBirth: "1997-03-15",
    age: 27,
    maritalStatus: "Single",
    address: "45 Allen Avenue, Ikeja, Lagos",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    joinDate: "2010-06-20",
    status: ["Active", "Baptized", "ETS"],
    alerts: ["Over-Age"],
    currentBand: "Youth Band",
    baptismDate: "2015-08-12",
    baptismLocation: "BCM Lagos",
    institution: "University of Lagos",
    course: "Computer Science",
    placeOfWork: "Tech Solutions Ltd",
  };

  const tabs = [
    { id: "bands", label: "Bands History", icon: Music },
    { id: "units", label: "Units", icon: Users },
    { id: "leadership", label: "Leadership", icon: Crown },
    { id: "classes", label: "Classes", icon: GraduationCap },
    { id: "attendance", label: "Attendance", icon: ClipboardCheck },
    { id: "notes", label: "Notes", icon: FileText },
  ];

  const bandsHistory = [
    {
      id: 1,
      band: "Youth Band",
      role: "Member",
      startDate: "2020-01-15",
      endDate: null,
      status: "Active",
      duration: "5 years",
    },
    {
      id: 2,
      band: "Children's Band",
      role: "Member",
      startDate: "2010-06-20",
      endDate: "2019-12-31",
      status: "Completed",
      duration: "9 years",
    },
  ];

  const units = [
    {
      id: 1,
      name: "Teaching Unit",
      role: "Coordinator",
      startDate: "2022-03-01",
      status: "Active",
      contributions: 24,
    },
    {
      id: 2,
      name: "Media Team",
      role: "Member",
      startDate: "2021-06-15",
      status: "Active",
      contributions: 18,
    },
  ];

  const leadership = [
    {
      id: 1,
      position: "Youth Band Secretary",
      term: "Jan 2023 - Dec 2023",
      status: "Active",
      performance: "Excellent",
    },
    {
      id: 2,
      position: "Class Coordinator",
      term: "Jan 2022 - Dec 2022",
      status: "Completed",
      performance: "Good",
    },
  ];

  const classes = [
    {
      id: 1,
      name: "Leadership Training",
      instructor: "Pastor David",
      startDate: "2023-01-10",
      endDate: "2023-03-15",
      status: "Completed",
      grade: "A",
      attendance: "95%",
    },
    {
      id: 2,
      name: "Bible Study Advanced",
      instructor: "Sister Grace",
      startDate: "2022-09-01",
      endDate: "2022-11-30",
      status: "Completed",
      grade: "A",
      attendance: "92%",
    },
    {
      id: 3,
      name: "Ministry Skills",
      instructor: "Brother John",
      startDate: "2024-01-08",
      endDate: null,
      status: "In Progress",
      grade: "-",
      attendance: "88%",
    },
  ];

  const attendanceData = {
    overall: "87%",
    thisMonth: "92%",
    lastMonth: "85%",
    trend: "up",
    recentRecords: [
      { date: "2025-12-28", service: "Sunday Service", status: "Present" },
      { date: "2025-12-21", service: "Sunday Service", status: "Present" },
      { date: "2025-12-14", service: "Sunday Service", status: "Absent" },
      { date: "2025-12-07", service: "Sunday Service", status: "Present" },
      { date: "2025-11-30", service: "Sunday Service", status: "Present" },
    ],
  };

  const notes = [
    {
      id: 1,
      date: "2025-01-15",
      author: "Admin User",
      category: "General",
      content: "Excellent leadership qualities demonstrated during youth camp.",
    },
    {
      id: 2,
      date: "2024-12-10",
      author: "Pastor David",
      category: "Leadership",
      content:
        "Recommended for band secretary position. Shows great organizational skills.",
    },
    {
      id: 3,
      date: "2024-11-05",
      author: "Sister Grace",
      category: "Academic",
      content:
        "Top performer in Bible Study class. Participates actively in discussions.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-[#222B45]">
                {memberData.firstName} {memberData.middleName}{" "}
                {memberData.surname}
              </h2>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {memberData.id}
              </Badge>
            </div>
            <p className="text-[#8F9BB3] mt-1">
              Member since{" "}
              {new Date(memberData.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onEdit && (
            <Button
              variant="outline"
              onClick={onEdit}
              className="border-[#EDF1F7]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              onClick={() => setIsAssignBandModalOpen(true)}
            >
              <Music className="w-4 h-4 mr-2" />
              Assign Band
            </Button>
            <Button
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              onClick={() => setIsAssignLeadershipRoleModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Role
            </Button>
            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <UserX className="w-4 h-4 mr-2" />
              Suspend
            </Button>
            <Button
              variant="outline"
              className="border-[#222B45] text-[#222B45] hover:bg-[#222B45] hover:text-white"
              onClick={() => setIsTransferMemberModalOpen(true)}
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Transfer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Bio Summary */}
          <Card className="border-[#EDF1F7] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#009AF4]" />
                Bio Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-[#009AF4] flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    {memberData.firstName.charAt(0)}
                    {memberData.surname.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t border-[#EDF1F7]">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#8F9BB3] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#8F9BB3]">Email</p>
                    <p className="text-sm text-[#222B45] wrap-break-word">
                      {memberData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#8F9BB3] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8F9BB3]">Phone</p>
                    <p className="text-sm text-[#222B45]">{memberData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#8F9BB3] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8F9BB3]">Address</p>
                    <p className="text-sm text-[#222B45]">
                      {memberData.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Cake className="w-4 h-4 text-[#8F9BB3] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8F9BB3]">Date of Birth</p>
                    <p className="text-sm text-[#222B45]">
                      {new Date(memberData.dateOfBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}{" "}
                      ({memberData.age} years)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#8F9BB3] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8F9BB3]">Baptism</p>
                    <p className="text-sm text-[#222B45]">
                      {new Date(memberData.baptismDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-0.5">
                      {memberData.baptismLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 pt-4 border-t border-[#EDF1F7]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9BB3]">Gender</span>
                  <span className="text-[#222B45] font-medium">
                    {memberData.gender}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9BB3]">Marital Status</span>
                  <span className="text-[#222B45] font-medium">
                    {memberData.maritalStatus}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8F9BB3]">Current Band</span>
                  <span className="text-[#222B45] font-medium">
                    {memberData.currentBand}
                  </span>
                </div>
              </div>

              {/* Education & Work */}
              <div className="space-y-2 pt-4 border-t border-[#EDF1F7]">
                <p className="text-xs font-semibold text-[#222B45] uppercase">
                  Education & Work
                </p>
                <div className="text-sm">
                  <p className="text-[#8F9BB3] text-xs">Institution</p>
                  <p className="text-[#222B45]">{memberData.institution}</p>
                </div>
                <div className="text-sm">
                  <p className="text-[#8F9BB3] text-xs">Course</p>
                  <p className="text-[#222B45]">{memberData.course}</p>
                </div>
                <div className="text-sm">
                  <p className="text-[#8F9BB3] text-xs">Employment</p>
                  <p className="text-[#222B45]">{memberData.placeOfWork}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Chips */}
          <Card className="border-[#EDF1F7] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#009AF4]" />
                Status & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Member Status */}
              <div>
                <p className="text-xs font-semibold text-[#8F9BB3] mb-2 uppercase">
                  Member Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {memberData.status.map((status) => (
                    <Badge
                      key={status}
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              {memberData.alerts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#8F9BB3] mb-2 uppercase">
                    Alerts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {memberData.alerts.map((alert) => (
                      <Badge
                        key={alert}
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {alert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="pt-4 border-t border-[#EDF1F7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <ClipboardCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8F9BB3]">Attendance Rate</p>
                      <p className="text-sm font-semibold text-[#222B45]">
                        {attendanceData.overall}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8F9BB3]">
                        Classes Completed
                      </p>
                      <p className="text-sm font-semibold text-[#222B45]">
                        {classes.filter((c) => c.status === "Completed").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8F9BB3]">Leadership Roles</p>
                      <p className="text-sm font-semibold text-[#222B45]">
                        {leadership.filter((l) => l.status === "Active").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Card className="border-[#EDF1F7] shadow-sm">
            {/* Tab Navigation */}
            <div className="border-b border-[#EDF1F7]">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-[#009AF4] text-[#009AF4] bg-[#009AF4]/5"
                          : "border-transparent text-[#8F9BB3] hover:text-[#009AF4] hover:bg-[#009AF4]/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <CardContent className="p-6">
              {/* Bands History Tab */}
              {activeTab === "bands" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#222B45]">
                      Band Membership History
                    </h3>
                    <Button
                      size="sm"
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Assign to Band
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {bandsHistory.map((band) => (
                      <Card
                        key={band.id}
                        className={`border-l-4 ${band.status === "Active" ? "border-l-green-500 bg-green-50/30" : "border-l-[#EDF1F7]"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-[#222B45]">
                                  {band.band}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={
                                    band.status === "Active"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                                  }
                                >
                                  {band.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-[#8F9BB3]">
                                {band.role}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {band.duration}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#8F9BB3]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                Started:{" "}
                                {new Date(band.startDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            {band.endDate && (
                              <div className="flex items-center gap-1">
                                <span>•</span>
                                <span>
                                  Ended:{" "}
                                  {new Date(band.endDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Units Tab */}
              {activeTab === "units" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#222B45]">
                      Active Units
                    </h3>
                    <Button
                      size="sm"
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add to Unit
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {units.map((unit) => (
                      <Card key={unit.id} className="border-[#EDF1F7]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-[#009AF4]" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#222B45]">
                                  {unit.name}
                                </h4>
                                <p className="text-xs text-[#8F9BB3]">
                                  {unit.role}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {unit.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm pt-3 border-t border-[#EDF1F7]">
                            <span className="text-[#8F9BB3]">
                              Since{" "}
                              {new Date(unit.startDate).toLocaleDateString(
                                "en-US",
                                { year: "numeric", month: "short" },
                              )}
                            </span>
                            <span className="text-[#222B45] font-medium">
                              {unit.contributions} contributions
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Leadership Tab */}
              {activeTab === "leadership" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#222B45]">
                      Leadership Positions
                    </h3>
                    <Button
                      size="sm"
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Assign Position
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {leadership.map((position) => (
                      <Card
                        key={position.id}
                        className={`border-l-4 ${position.status === "Active" ? "border-l-orange-500 bg-orange-50/30" : "border-l-[#EDF1F7]"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Crown className="w-4 h-4 text-orange-600" />
                                <h4 className="font-semibold text-[#222B45]">
                                  {position.position}
                                </h4>
                              </div>
                              <p className="text-sm text-[#8F9BB3]">
                                {position.term}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  position.status === "Active"
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }
                              >
                                {position.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#8F9BB3]" />
                            <span className="text-sm text-[#8F9BB3]">
                              Performance:
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                position.performance === "Excellent"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {position.performance}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes Tab */}
              {activeTab === "classes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#222B45]">
                      Class Enrollment
                    </h3>
                    <Button
                      size="sm"
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Enroll in Class
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <Card key={classItem.id} className="border-[#EDF1F7]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-[#222B45]">
                                  {classItem.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={
                                    classItem.status === "Completed"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                  }
                                >
                                  {classItem.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-[#8F9BB3]">
                                Instructor: {classItem.instructor}
                              </p>
                            </div>
                            {classItem.grade !== "-" && (
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 text-lg"
                              >
                                {classItem.grade}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#EDF1F7]">
                            <div>
                              <p className="text-xs text-[#8F9BB3]">Duration</p>
                              <p className="text-sm text-[#222B45]">
                                {new Date(
                                  classItem.startDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                })}{" "}
                                -
                                {classItem.endDate
                                  ? new Date(
                                      classItem.endDate,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                    })
                                  : "Present"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#8F9BB3]">
                                Attendance
                              </p>
                              <p className="text-sm font-medium text-[#222B45]">
                                {classItem.attendance}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === "attendance" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#222B45]">
                      Attendance Records
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#EDF1F7]"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-[#EDF1F7]">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-[#8F9BB3] mb-1">
                          Overall Rate
                        </p>
                        <p className="text-2xl font-semibold text-[#009AF4]">
                          {attendanceData.overall}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-[#EDF1F7]">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-[#8F9BB3] mb-1">
                          This Month
                        </p>
                        <p className="text-2xl font-semibold text-green-600">
                          {attendanceData.thisMonth}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-[#EDF1F7]">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-[#8F9BB3] mb-1">
                          Last Month
                        </p>
                        <p className="text-2xl font-semibold text-[#222B45]">
                          {attendanceData.lastMonth}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Records */}
                  <div>
                    <h4 className="font-medium text-[#222B45] mb-3">
                      Recent Records
                    </h4>
                    <div className="space-y-2">
                      {attendanceData.recentRecords.map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-[#EDF1F7] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                            <div>
                              <p className="text-sm font-medium text-[#222B45]">
                                {record.service}
                              </p>
                              <p className="text-xs text-[#8F9BB3]">
                                {new Date(record.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              record.status === "Present"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#222B45]">
                      Member Notes
                    </h3>
                    <Button
                      size="sm"
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {notes.map((note) => (
                      <Card key={note.id} className="border-[#EDF1F7]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#009AF4] flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">
                                  {note.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#222B45]">
                                  {note.author}
                                </p>
                                <p className="text-xs text-[#8F9BB3]">
                                  {new Date(note.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {note.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#222B45] leading-relaxed">
                            {note.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Band Modal */}
      <AssignBandModal
        isOpen={isAssignBandModalOpen}
        onClose={() => setIsAssignBandModalOpen(false)}
        memberData={{
          id: memberData.id,
          name: `${memberData.firstName} ${memberData.middleName} ${memberData.surname}`,
          gender: memberData.gender as "Male" | "Female",
          age: memberData.age,
          dateOfBirth: memberData.dateOfBirth,
          currentBand: memberData.currentBand,
        }}
        onAssign={(assignment) => {
          console.log("Band assigned:", assignment);
          setIsAssignBandModalOpen(false);
        }}
      />

      {/* Assign Leadership Role Modal */}
      <AssignLeadershipRoleModal
        isOpen={isAssignLeadershipRoleModalOpen}
        onClose={() => setIsAssignLeadershipRoleModalOpen(false)}
        memberData={{
          id: memberData.id,
          name: `${memberData.firstName} ${memberData.middleName} ${memberData.surname}`,
          currentRoles: ["Youth Band Secretary", "Teaching Unit Coordinator"],
        }}
        onAssign={(assignment) => {
          console.log("Leadership role assigned:", assignment);
          setIsAssignLeadershipRoleModalOpen(false);
        }}
      />

      {/* Transfer Member Modal */}
      <TransferMemberModal
        isOpen={isTransferMemberModalOpen}
        onClose={() => setIsTransferMemberModalOpen(false)}
        memberData={{
          id: memberData.id,
          name: `${memberData.firstName} ${memberData.middleName} ${memberData.surname}`,
          currentBand: memberData.currentBand,
          age: memberData.age,
          gender: memberData.gender as "Male" | "Female",
        }}
        onTransfer={(assignment) => {
          console.log("Member transferred:", assignment);
          setIsTransferMemberModalOpen(false);
        }}
      />
    </div>
  );
}
