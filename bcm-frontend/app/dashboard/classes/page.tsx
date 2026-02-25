"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Plus,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  Users,
  Calendar,
  Church,
  CircleAlert,
  EllipsisVertical,
  UserCheck,
  Target,
  Eye,
  Edit,
  Archive,
  Funnel,
  Droplet,
  Sparkles,
  CircleCheck,
  CircleCheckBig,
  ClipboardCheck,
  Music,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ClassesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Pre-Youth Class" | "Baptisimal Class" | "ETS Class"
  >("Pre-Youth Class");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[#222B45] mb-2">
              Class Management
            </h1>
            <p className="text-[#8F9BB3]">
              Member training and integration lifecycle
            </p>
          </div>
        </div>

        {(activeTab === "Baptisimal Class" || activeTab === "ETS Class") && (
          <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <div className="bg-[#F7F9FC] p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab("Pre-Youth Class")}
            className={`relative flex items-center gap-2 px-4 py-2 ${
              activeTab === "Pre-Youth Class"
                ? "text-[#009AF4]"
                : "text-[#8F9BB3]"
            }`}
          >
            <Users className="w-4 h-4" />
            Pre-Youth Class
            <span
              className={`absolute left-0 bottom-0 h-[2px] bg-[#009AF4] w-full ${
                activeTab === "Pre-Youth Class" ? "" : "hidden"
              }`}
            />
          </button>
          <button
            onClick={() => setActiveTab("Baptisimal Class")}
            className={`relative flex items-center gap-2 px-4 py-2 ${
              activeTab === "Baptisimal Class"
                ? "text-[#009AF4]"
                : "text-[#8F9BB3]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Baptisimal Class
            <span
              className={`absolute left-0 bottom-0 h-[2px] bg-[#009AF4] w-full ${
                activeTab === "Baptisimal Class" ? "" : "hidden"
              }`}
            />
          </button>
          <button
            onClick={() => setActiveTab("ETS Class")}
            className={`relative flex items-center gap-2 px-4 py-2 ${
              activeTab === "ETS Class" ? "text-[#009AF4]" : "text-[#8F9BB3]"
            }`}
          >
            <Church className="w-4 h-4" />
            ETS Class
            <span
              className={`absolute left-0 bottom-0 h-[2px] bg-[#009AF4] w-full ${
                activeTab === "ETS Class" ? "" : "hidden"
              }`}
            />
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "Pre-Youth Class" && (
            <CardContent className="p-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Active Batches
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          1
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Members in Class
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          64
                        </p>
                        <div className="mt-4 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span className="text-xs">Active enrollement</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Ready for Graduation
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          12
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Pending Approvals
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          3
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

              <Card className="rounded-lg border-blue-200 bg-blue-50 shadow-sm mt-4">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <CircleAlert className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 pl-3">
                      <h1 className="text-sm font-semibold text-blue-900 mb-1">
                        Automatic Batch Creation
                      </h1>
                      <p className="text-sm text-blue-700">
                        Pre-Youth Class batches are automatically created
                        annually. Manual batch creation is not required for this
                        class type.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between mb-4 mt-4">
                <h2 className="text-lg font-semibold text-[#222B45]">
                  Pre-Youth Class Batches
                </h2>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center">
                  2 Batches
                </span>
              </div>

              <div className="space-y-8">
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-[#222B45]">
                        2025
                      </h3>
                    </div>
                    <div className="flex-1 h-px bg-[#EDF1F7]"></div>
                    <span className="text-sm text-[#8F9BB3]">1 Batch</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-card text-card-foreground flex flex-col lg:flex-row lg:items-center gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-all hover:border-[#009AF4]/30">
                      <div className="flex-1 space-y-4 mt-4 ml-4 mb-4">
                        <div className="flex justify-between gap-4">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#222B45] mb-2 truncate">
                                Pre-Youth Class 2025
                              </h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Active</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                                  <Calendar className="w-3 h-3" />
                                  <span>2025</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                  <EllipsisVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/dashboard/classes/2025`)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Batch
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/dashboard/classes/2025/edit`)
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Batch
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 border-t"
                                  onClick={() =>
                                    alert("Archive functionality coming soon")
                                  }
                                >
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive Batch
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mr-3">
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Members
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-[#222B45]">
                              64
                            </p>
                            <p className="text-xs text-[#8F9BB3] mt-0.5">
                              of 80
                            </p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Leadership
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <CircleAlert className="w-4 h-4 text-orange-700" />
                              <span className="text-sm font-medium text-orange-700">
                                Pending
                              </span>
                            </div>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Ready to Graduate
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-[#222B45]">
                              12
                            </p>
                            <p className="text-xs text-[#8F9BB3] mt-0.5">
                              19% ready
                            </p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Completion
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-[#222B45]">
                              35%
                            </p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-[#009AF4] transition-all duration-300"
                                style={{ width: "35%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                            <Calendar className="w-4 h-4" />
                            <span>Jan 5, 2025 → Nov 30, 2025</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                            <UserCheck className="w-4 h-4" />
                            <span>Sister Abena Kofi</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                            <TrendingUp className="w-4 h-4" />
                            <span>77% attendance</span>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-48 flex lg:flex-col items-center lg:items-stretch gap-3 lg:gap-4 ml-4 mr-4 mb-4">
                        <div className="flex-1 lg:flex-none">
                          <div className="p-4 bg-white border-2 border-dashed rounded-lg text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 border-red-200 flex items-center justify-center">
                                <CircleAlert className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-[#8F9BB3]">
                                  Readiness Status
                                </p>
                                <span className="text-xs font-medium text-red-600">
                                  Low Readiness
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="inline-flex items-center flex-1 lg:flex-none h-9 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm font-medium justify-center">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-[#222B45]">
                        2024
                      </h3>
                    </div>
                    <div className="flex-1 h-px bg-[#EDF1F7]"></div>
                    <span className="text-sm text-[#8F9BB3]">1 Batch</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-card text-card-foreground flex flex-col lg:flex-row lg:items-center gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-all hover:border-[#009AF4]/30">
                      <div className="flex-1 space-y-4 mt-4 ml-4 mb-4">
                        <div className="flex justify-between gap-4">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#222B45] mb-2 truncate">
                                Pre-Youth Class 2025
                              </h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                                  <Award className="w-3 h-3" />
                                  <span>Completed</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                                  <Calendar className="w-3 h-3" />
                                  <span>2024</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                  <EllipsisVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/dashboard/classes/2025`)
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Batch
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/dashboard/classes/2025/edit`)
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Batch
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 border-t">
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive Batch
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mr-3">
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Members
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-[#222B45]">
                              58
                            </p>
                            <p className="text-xs text-[#8F9BB3] mt-0.5">
                              of 70
                            </p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Leadership
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCircle className="w-4 h-4 text-green-700" />
                              <span className="text-sm font-medium text-green-700">
                                Assigned
                              </span>
                            </div>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Ready to Graduate
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-[#222B45]">
                              58
                            </p>
                            <p className="text-xs text-[#8F9BB3] mt-0.5">
                              100% ready
                            </p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-[#8F9BB3]">
                                Completion
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-[#222B45]">
                              100%
                            </p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full bg-[#009AF4] transition-all duration-300"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                            <Calendar className="w-4 h-4" />
                            <span>Jan 8, 2024 → Nov 25, 2024</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                            <UserCheck className="w-4 h-4" />
                            <span>Sister Ama Ofori</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]">
                            <TrendingUp className="w-4 h-4" />
                            <span>91% attendance</span>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-48 flex lg:flex-col items-center lg:items-stretch gap-3 lg:gap-4 ml-4 mr-4 mb-4">
                        <div className="flex-1 lg:flex-none">
                          <div className="p-4 bg-white border-2 border-dashed rounded-lg text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 border-green-200 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-[#8F9BB3]">
                                  Readiness Status
                                </p>
                                <span className="text-xs font-medium text-green-600">
                                  High Readiness
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="inline-flex items-center flex-1 lg:flex-none h-9 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm font-medium justify-center">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {activeTab === "Baptisimal Class" && (
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Active Batches
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          2
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Members in Class
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          45
                        </p>
                        <div className="mt-4 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span className="text-xs">Active enrollement</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Ready for Graduation
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          38
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Pending Approvals
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          7
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

              <div className="flex items-center justify-between mb-4 mt-4">
                <h2 className="text-lg font-semibold text-[#222B45]">
                  Baptisimal Class Batches
                </h2>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-xs">
                  4 Batches
                </span>
              </div>

              <Card className="rounded-lg border-blue-200 bg-blue-50 shadow-sm">
                <CardContent className="p-1">
                  <div className="flex items-start justify-between pl-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <CircleAlert className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 pl-3">
                      <h1 className="text-sm font-semibold text-blue-900 mb-1">
                        System-Managed Batches
                      </h1>
                      <p className="text-sm text-blue-700">
                        Baptismal Class batches are automatically created by the
                        system for January and August intake periods. Batches
                        cannot be deleted but leadership and member assignments
                        can be managed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-4 items-center justify-between ">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <Input
                    placeholder="Search batches by name or month..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-[#EDF1F7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Funnel className="w-4 h-4 mr-1" />
                  <select className="rounded-lg border border-[#EDF1F7] focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3">
                    <option value="">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#222B45]">
                        January Batches
                      </h2>
                      <p className="text-sm text-[#8F9BB3]">
                        First semester intake (January - May)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-sm">
                    3 Batches
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  BCJAN2026
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>January 2026</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Jan 5, 2026 - may 31, 2026</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                0 / 50
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">0%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-gray-50 text-gray-700 border-gray-200">
                              <Calendar className="w-3 h-3" />
                              <span className="ml-1">Not Started</span>
                            </span>
                            <span
                              data-slot="badge"
                              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-orange-50 text-orange-700 border-orange-200"
                            >
                              <CircleAlert className="w-3 h-3" />
                              <span className="ml-1">No Leadership</span>
                            </span>
                          </div>
                          <button
                            data-slot="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  BCJAN2025
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>January 2025</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Jan 5, 2025 - may 31, 2025</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                48 / 50
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "98%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                100%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <CircleCheckBig className="w-3 h-3" />
                              <span className="ml-1">Completed</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">3 Leaders</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3" />
                              <span className="ml-1">48 Graduated</span>
                            </span>
                          </div>
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  BCJAN2024
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>January 2024</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Jan 5, 2024 - may 31, 2024</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                50 / 50
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                100%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <CircleCheckBig className="w-3 h-3" />
                              <span className="ml-1">Completed</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">3 Leaders</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3" />
                              <span className="ml-1">50 Graduated</span>
                            </span>
                          </div>
                          <button
                            data-slot="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4 mt-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#222B45]">
                        August Batches
                      </h2>
                      <p className="text-sm text-[#8F9BB3]">
                        Second semester intake (August - December)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-sm">
                    3 Batches
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  BCAUG2025
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>August 2025</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Aug 5, 2025 - Dec 31, 2025</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                42 / 50
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "84%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                65%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: "65%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-blue-50 text-blue-700 border-blue-200">
                              <Clock className="w-3 h-3" />
                              <span className="ml-1">In Progress</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">3 leaders</span>
                            </span>
                          </div>
                          <button
                            data-slot="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  BCJAN2024
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>August 2025</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Aug 1, 2024 - Dec 31, 2024</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                45 / 50
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "95%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                65%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "65%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <CircleCheckBig className="w-3 h-3" />
                              <span className="ml-1">Completed</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">3 Leaders</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3" />
                              <span className="ml-1">45 Graduated</span>
                            </span>
                          </div>
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  BCJAN2023
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>August 2023</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Aug 1, 2023 - Dec 31, 2023</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                38 / 50
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "76%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                100%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <CircleCheckBig className="w-3 h-3" />
                              <span className="ml-1">Completed</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">3 Leaders</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3" />
                              <span className="ml-1">38 Graduated</span>
                            </span>
                          </div>
                          <button
                            data-slot="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {activeTab === "ETS Class" && (
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Active Batches
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          2
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Members in Class
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          32
                        </p>
                        <div className="mt-4 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span className="text-xs">Active enrollement</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Ready for Graduation
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          0
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">
                          Pending Approvals
                        </p>
                        <p className="text-3xl font-semibold text-[#222B45]">
                          5
                        </p>
                        <div className="mt-4 flex items-center gap-1">
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

              <div className="flex items-center justify-between mb-4 mt-4">
                <h2 className="text-lg font-semibold text-[#222B45]">
                  ETS Class Batches
                </h2>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-xs">
                  3 Batches
                </span>
              </div>

              <Card className="rounded-lg border-green-200 bg-green-50 shadow-sm">
                <CardContent className="p-1">
                  <div className="flex items-start justify-between pl-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <CircleAlert className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 pl-3">
                      <h1 className="text-sm font-semibold text-green-900 mb-1">
                        System-Managed Batches
                      </h1>
                      <p className="text-xs text-green-700">
                        ETS (Establishment) Class batches are automatically
                        created by the system for January and August intake
                        periods. Batches cannot be deleted but leadership and
                        member assignments can be managed. Track band
                        eligibility and approval status for each batch.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-4 items-center justify-between ">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <Input
                    placeholder="Search batches by name or month..."
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-[#EDF1F7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Funnel className="w-4 h-4 mr-1" />
                  <select className="rounded-lg border border-[#EDF1F7] focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3">
                    <option value="">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#222B45]">
                        January Batches
                      </h2>
                      <p className="text-sm text-[#8F9BB3]">
                        First semester intake (January - june)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-green-50 text-green-700 border-green-200 items-center text-sm">
                    3 Batches
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  ETSJAN2026
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>January 2026</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Jan 5, 2026 - Jun 30, 2026</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                0 / 60
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900">
                                  Pending Approvals
                                </span>
                              </div>
                            </div>
                            <p className="text-2xl font-semibold text-orange-700">
                              0
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              All processed
                            </p>
                          </div>
                          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-teal-600" />
                                <span className="text-sm font-medium text-teal-900">
                                  Band Eligible
                                </span>
                              </div>
                            </div>
                            <p className="text-2xl font-semibold text-teal-700">
                              0
                            </p>
                            <p className="text-xs text-teal-600 mt-1">
                              None ready
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">0%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "0%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-gray-50 text-gray-700 border-gray-200">
                              <Calendar className="w-3 h-3" />
                              <span className="ml-1">Not Started</span>
                            </span>
                            <span
                              data-slot="badge"
                              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-orange-50 text-orange-700 border-orange-200"
                            >
                              <CircleAlert className="w-3 h-3" />
                              <span className="ml-1">No Leadership</span>
                            </span>
                          </div>
                          <button
                            data-slot="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  ETSJAN2025
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>January 2025</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Jan 5, 2025 - Jun 30, 2025</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                55 / 60
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "91.67%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900">
                                  Pending Approvals
                                </span>
                              </div>
                            </div>
                            <p className="text-2xl font-semibold text-orange-700">
                              0
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              All processed
                            </p>
                          </div>
                          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-teal-600" />
                                <span className="text-sm font-medium text-teal-900">
                                  Band Eligible
                                </span>
                              </div>
                            </div>
                            <p className="text-2xl font-semibold text-teal-700">
                              55
                            </p>
                            <p className="text-xs text-teal-600 mt-1">
                              100% ready
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                100%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <CircleCheckBig className="w-3 h-3" />
                              <span className="ml-1">Completed</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">4 Leaders</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3" />
                              <span className="ml-1">55 Graduated</span>
                            </span>
                          </div>
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 pb-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <Droplet className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#222B45]">
                                  ETSJAN2024
                                </h3>
                                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                  <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                  Auto-Created
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>January 2024</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Jan 5, 2024 - Jun 30, 2024</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                    <EllipsisVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/dashboard/classes/2025`)
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Batch Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/classes/2025/edit`,
                                      )
                                    }
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Edit Batch Leadership
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Members Enrolled
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                60 / 60
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-900">
                                  Pending Approvals
                                </span>
                              </div>
                            </div>
                            <p className="text-2xl font-semibold text-orange-700">
                              0
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              All processed
                            </p>
                          </div>
                          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-teal-600" />
                                <span className="text-sm font-medium text-teal-900">
                                  Band Eligible
                                </span>
                              </div>
                            </div>
                            <p className="text-2xl font-semibold text-teal-700">
                              60
                            </p>
                            <p className="text-xs text-teal-600 mt-1">
                              100% ready
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-medium text-[#222B45]">
                                  Completion Progress
                                </h3>
                              </div>
                              <span className="text-xs text-[#8F9BB3]">
                                100%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <CircleCheckBig className="w-3 h-3" />
                              <span className="ml-1">Completed</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                              <UserCheck className="w-3 h-3" />
                              <span className="ml-1">4 Leaders</span>
                            </span>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                              <Award className="w-3 h-3" />
                              <span className="ml-1">60 Graduated</span>
                            </span>
                          </div>
                          <button
                            data-slot="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4 mt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#222B45]">
                          August Batches
                        </h2>
                        <p className="text-sm text-[#8F9BB3]">
                          Second semester intake (August - December)
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-green-50 text-green-700 border-green-200 items-center text-sm">
                      3 Batches
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 pb-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-[#222B45]">
                                    ETSAUG2025
                                  </h3>
                                  <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                    <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                    Auto-Created
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>August 2025</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Aug 5, 2025 - Dec 31, 2025</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                      <EllipsisVertical className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/dashboard/classes/2025`)
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Batch Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/classes/2025/edit`,
                                        )
                                      }
                                    >
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Edit Batch Leadership
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-blue-600" />
                                  <h3 className="text-sm font-medium text-[#222B45]">
                                    Members Enrolled
                                  </h3>
                                </div>
                                <span className="text-xs text-[#8F9BB3]">
                                  52 / 60
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: "86.67%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-orange-900">
                                    Pending Approvals
                                  </span>
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-orange-700">
                                0
                              </p>
                              <p className="text-xs text-orange-600 mt-1">
                                All processed
                              </p>
                            </div>
                            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Music className="w-4 h-4 text-teal-600" />
                                  <span className="text-sm font-medium text-teal-900">
                                    Band Eligible
                                  </span>
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-teal-700">
                                34
                              </p>
                              <p className="text-xs text-teal-600 mt-1">
                                65% ready
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                  <h3 className="text-sm font-medium text-[#222B45]">
                                    Completion Progress
                                  </h3>
                                </div>
                                <span className="text-xs text-[#8F9BB3]">
                                  72%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-teal-600 h-2 rounded-full"
                                  style={{ width: "72%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-blue-50 text-blue-700 border-blue-200">
                                <Clock className="w-3 h-3" />
                                <span className="ml-1">In Progress</span>
                              </span>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                                <UserCheck className="w-3 h-3" />
                                <span className="ml-1">4 leaders</span>
                              </span>
                            </div>
                            <button
                              data-slot="button"
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 pb-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-[#222B45]">
                                    ETSAUG2024
                                  </h3>
                                  <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                    <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                    Auto-Created
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>August 2024</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Aug 1, 2024 - Jan 31, 2025</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                      <EllipsisVertical className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/dashboard/classes/2025`)
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Batch Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/classes/2025/edit`,
                                        )
                                      }
                                    >
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Edit Batch Leadership
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-blue-600" />
                                  <h3 className="text-sm font-medium text-[#222B45]">
                                    Members Enrolled
                                  </h3>
                                </div>
                                <span className="text-xs text-[#8F9BB3]">
                                  48 / 60
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{ width: "80%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-orange-900">
                                    Pending Approvals
                                  </span>
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-orange-700">
                                0
                              </p>
                              <p className="text-xs text-orange-600 mt-1">
                                All processed
                              </p>
                            </div>
                            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Music className="w-4 h-4 text-teal-600" />
                                  <span className="text-sm font-medium text-teal-900">
                                    Band Eligible
                                  </span>
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-teal-700">
                                48
                              </p>
                              <p className="text-xs text-teal-600 mt-1">
                                100% ready
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                  <h3 className="text-sm font-medium text-[#222B45]">
                                    Completion Progress
                                  </h3>
                                </div>
                                <span className="text-xs text-[#8F9BB3]">
                                  100%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                                <CircleCheckBig className="w-3 h-3" />
                                <span className="ml-1">Completed</span>
                              </span>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                                <UserCheck className="w-3 h-3" />
                                <span className="ml-1">4 Leaders</span>
                              </span>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                                <Award className="w-3 h-3" />
                                <span className="ml-1">48 Graduated</span>
                              </span>
                            </div>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 pb-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-[#222B45]">
                                    ETSAUG2023
                                  </h3>
                                  <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs ">
                                    <Sparkles className="w-3 h-3 text-purple-600 ml-1 mr-1" />
                                    Auto-Created
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>August 2023</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Aug 1, 2023 - Jan 31, 2024</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                      <EllipsisVertical className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/dashboard/classes/2025`)
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Batch Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/classes/2025/edit`,
                                        )
                                      }
                                    >
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Edit Batch Leadership
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-blue-600" />
                                  <h3 className="text-sm font-medium text-[#222B45]">
                                    Members Enrolled
                                  </h3>
                                </div>
                                <span className="text-xs text-[#8F9BB3]">
                                  42 / 60
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-teal-600 h-2 rounded-full"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-medium text-orange-900">
                                    Pending Approvals
                                  </span>
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-orange-700">
                                0
                              </p>
                              <p className="text-xs text-orange-600 mt-1">
                                All processed
                              </p>
                            </div>
                            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <Music className="w-4 h-4 text-teal-600" />
                                  <span className="text-sm font-medium text-teal-900">
                                    Band Eligible
                                  </span>
                                </div>
                              </div>
                              <p className="text-2xl font-semibold text-teal-700">
                                42
                              </p>
                              <p className="text-xs text-teal-600 mt-1">
                                100% ready
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                  <h3 className="text-sm font-medium text-[#222B45]">
                                    Completion Progress
                                  </h3>
                                </div>
                                <span className="text-xs text-[#8F9BB3]">
                                  100%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                                <CircleCheckBig className="w-3 h-3" />
                                <span className="ml-1">Completed</span>
                              </span>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-green-50 text-green-700 border-green-200">
                                <UserCheck className="w-3 h-3" />
                                <span className="ml-1">4 Leaders</span>
                              </span>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-purple-50 text-purple-700 border-purple-200">
                                <Award className="w-3 h-3" />
                                <span className="ml-1">42 Graduated</span>
                              </span>
                            </div>
                            <button
                              data-slot="button"
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-[#009AF4] hover:bg-[#0086D6] text-white"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </div>
      </div>
    </div>
  );
}
