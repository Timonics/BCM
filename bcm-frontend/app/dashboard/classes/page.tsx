"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
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

//Types

interface BaptismalBatch {
  id: string;
  month: string;
  year: number;
  dateRange: string;
  enrolled: number;
  capacity: number;
  enrolledPercent: number;
  completionPercent: number;
  completionColor: string;
  enrolledColor: string;
  status: "Not Started" | "In Progress" | "Completed";
  leaders: number | null; // null = no leadership
  graduated: number | null;
}

interface EtsBatch {
  id: string;
  month: string;
  year: number;
  dateRange: string;
  enrolled: number;
  capacity: number;
  enrolledPercent: number;
  enrolledColor: string;
  pendingApprovals: number;
  bandEligible: number;
  bandEligibleLabel: string;
  completionPercent: number;
  completionColor: string;
  status: "Not Started" | "In Progress" | "Completed";
  leaders: number | null;
  graduated: number | null;
}

//Baptismal Data

const baptismalJanBatches: BaptismalBatch[] = [
  {
    id: "BCJAN2026",
    month: "January",
    year: 2026,
    dateRange: "Jan 5, 2026 - May 31, 2026",
    enrolled: 0,
    capacity: 50,
    enrolledPercent: 0,
    completionPercent: 0,
    completionColor: "bg-blue-600",
    enrolledColor: "bg-blue-600",
    status: "Not Started",
    leaders: null,
    graduated: null,
  },
  {
    id: "BCJAN2025",
    month: "January",
    year: 2025,
    dateRange: "Jan 5, 2025 - May 31, 2025",
    enrolled: 48,
    capacity: 50,
    enrolledPercent: 96,
    completionPercent: 100,
    completionColor: "bg-green-600",
    enrolledColor: "bg-orange-600",
    status: "Completed",
    leaders: 3,
    graduated: 48,
  },
  {
    id: "BCJAN2024",
    month: "January",
    year: 2024,
    dateRange: "Jan 5, 2024 - May 31, 2024",
    enrolled: 50,
    capacity: 50,
    enrolledPercent: 100,
    completionPercent: 100,
    completionColor: "bg-green-600",
    enrolledColor: "bg-orange-600",
    status: "Completed",
    leaders: 3,
    graduated: 50,
  },
];

const baptismalAugBatches: BaptismalBatch[] = [
  {
    id: "BCAUG2025",
    month: "August",
    year: 2025,
    dateRange: "Aug 5, 2025 - Dec 31, 2025",
    enrolled: 42,
    capacity: 50,
    enrolledPercent: 84,
    completionPercent: 65,
    completionColor: "bg-blue-600",
    enrolledColor: "bg-orange-600",
    status: "In Progress",
    leaders: 3,
    graduated: null,
  },
  {
    id: "BCAUG2024",
    month: "August",
    year: 2024,
    dateRange: "Aug 1, 2024 - Dec 31, 2024",
    enrolled: 45,
    capacity: 50,
    enrolledPercent: 90,
    completionPercent: 65,
    completionColor: "bg-green-600",
    enrolledColor: "bg-orange-600",
    status: "Completed",
    leaders: 3,
    graduated: 45,
  },
  {
    id: "BCAUG2023",
    month: "August",
    year: 2023,
    dateRange: "Aug 1, 2023 - Dec 31, 2023",
    enrolled: 38,
    capacity: 50,
    enrolledPercent: 76,
    completionPercent: 100,
    completionColor: "bg-green-600",
    enrolledColor: "bg-orange-600",
    status: "Completed",
    leaders: 3,
    graduated: 38,
  },
];

//ETS Data

const etsJanBatches: EtsBatch[] = [
  {
    id: "ETSJAN2026",
    month: "January",
    year: 2026,
    dateRange: "Jan 5, 2026 - Jun 30, 2026",
    enrolled: 0,
    capacity: 60,
    enrolledPercent: 0,
    enrolledColor: "bg-green-600",
    pendingApprovals: 0,
    bandEligible: 0,
    bandEligibleLabel: "None ready",
    completionPercent: 0,
    completionColor: "bg-green-600",
    status: "Not Started",
    leaders: null,
    graduated: null,
  },
  {
    id: "ETSJAN2025",
    month: "January",
    year: 2025,
    dateRange: "Jan 5, 2025 - Jun 30, 2025",
    enrolled: 55,
    capacity: 60,
    enrolledPercent: 91.67,
    enrolledColor: "bg-orange-600",
    pendingApprovals: 0,
    bandEligible: 55,
    bandEligibleLabel: "100% ready",
    completionPercent: 100,
    completionColor: "bg-green-600",
    status: "Completed",
    leaders: 4,
    graduated: 55,
  },
  {
    id: "ETSJAN2024",
    month: "January",
    year: 2024,
    dateRange: "Jan 5, 2024 - Jun 30, 2024",
    enrolled: 60,
    capacity: 60,
    enrolledPercent: 100,
    enrolledColor: "bg-orange-600",
    pendingApprovals: 0,
    bandEligible: 60,
    bandEligibleLabel: "100% ready",
    completionPercent: 100,
    completionColor: "bg-green-600",
    status: "Completed",
    leaders: 4,
    graduated: 60,
  },
];

const etsAugBatches: EtsBatch[] = [
  {
    id: "ETSAUG2025",
    month: "August",
    year: 2025,
    dateRange: "Aug 5, 2025 - Dec 31, 2025",
    enrolled: 52,
    capacity: 60,
    enrolledPercent: 86.67,
    enrolledColor: "bg-orange-600",
    pendingApprovals: 0,
    bandEligible: 34,
    bandEligibleLabel: "65% ready",
    completionPercent: 72,
    completionColor: "bg-teal-600",
    status: "In Progress",
    leaders: 4,
    graduated: null,
  },
  {
    id: "ETSAUG2024",
    month: "August",
    year: 2024,
    dateRange: "Aug 1, 2024 - Jan 31, 2025",
    enrolled: 48,
    capacity: 60,
    enrolledPercent: 80,
    enrolledColor: "bg-orange-600",
    pendingApprovals: 0,
    bandEligible: 48,
    bandEligibleLabel: "100% ready",
    completionPercent: 100,
    completionColor: "bg-green-600",
    status: "Completed",
    leaders: 4,
    graduated: 48,
  },
  {
    id: "ETSAUG2023",
    month: "August",
    year: 2023,
    dateRange: "Aug 1, 2023 - Jan 31, 2024",
    enrolled: 42,
    capacity: 60,
    enrolledPercent: 70,
    enrolledColor: "bg-teal-600",
    pendingApprovals: 0,
    bandEligible: 42,
    bandEligibleLabel: "100% ready",
    completionPercent: 100,
    completionColor: "bg-green-600",
    status: "Completed",
    leaders: 4,
    graduated: 42,
  },
];

//Reusable badge classes

const badgeBase =
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden";

const viewBtnClass =
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-8 rounded-md gap-1.5 px-3 bg-[#009AF4] hover:bg-[#0086D6] text-white";

//Main Component

export default function ClassesPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "Pre-Youth Class" | "baptismal Class" | "ETS Class"
  >("Pre-Youth Class");

  // Baptismal filters
  const [baptismalSearch, setBaptismalSearch] = useState("");
  const [baptismalYear, setBaptismalYear] = useState("");

  // ETS filters
  const [etsSearch, setEtsSearch] = useState("");
  const [etsYear, setEtsYear] = useState("");

  //Filter helpers

  function filterBaptismal(batches: BaptismalBatch[]) {
    return batches.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(baptismalSearch.toLowerCase()) ||
        b.month.toLowerCase().includes(baptismalSearch.toLowerCase());
      const matchesYear = !baptismalYear || String(b.year) === baptismalYear;
      return matchesSearch && matchesYear;
    });
  }

  function filterEts(batches: EtsBatch[]) {
    return batches.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(etsSearch.toLowerCase()) ||
        b.month.toLowerCase().includes(etsSearch.toLowerCase());
      const matchesYear = !etsYear || String(b.year) === etsYear;
      return matchesSearch && matchesYear;
    });
  }

  const filteredBcJan = filterBaptismal(baptismalJanBatches);
  const filteredBcAug = filterBaptismal(baptismalAugBatches);
  const filteredEtsJan = filterEts(etsJanBatches);
  const filteredEtsAug = filterEts(etsAugBatches);

  //Batch card renderers

  function renderBaptismalCard(b: BaptismalBatch) {
    return (
      <div
        key={b.id}
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
      >
        <CardContent className="p-4 pb-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-[#222B45]">{b.id}</h3>
                    <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs">
                      <Sparkles className="w-3 h-3 text-purple-600 mr-1" />
                      Auto-Created
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{b.month} {b.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{b.dateRange}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                    <EllipsisVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/${b.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Batch Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/${b.id}/edit`)}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Edit Batch Leadership
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Enrollment progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-[#222B45]">Members Enrolled</h3>
                  </div>
                  <span className="text-xs text-[#8F9BB3]">{b.enrolled} / {b.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${b.enrolledColor} h-2 rounded-full`} style={{ width: `${b.enrolledPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Completion progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-[#222B45]">Completion Progress</h3>
                  </div>
                  <span className="text-xs text-[#8F9BB3]">{b.completionPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${b.completionColor} h-2 rounded-full`} style={{ width: `${b.completionPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Footer badges */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status badge */}
                {b.status === "Not Started" && (
                  <span className={`${badgeBase} bg-gray-50 text-gray-700 border-gray-200`}>
                    <Calendar className="w-3 h-3" />
                    <span className="ml-1">Not Started</span>
                  </span>
                )}
                {b.status === "In Progress" && (
                  <span className={`${badgeBase} bg-blue-50 text-blue-700 border-blue-200`}>
                    <Clock className="w-3 h-3" />
                    <span className="ml-1">In Progress</span>
                  </span>
                )}
                {b.status === "Completed" && (
                  <span className={`${badgeBase} bg-green-50 text-green-700 border-green-200`}>
                    <CircleCheckBig className="w-3 h-3" />
                    <span className="ml-1">Completed</span>
                  </span>
                )}
                {/* Leadership badge */}
                {b.leaders === null ? (
                  <span className={`${badgeBase} bg-orange-50 text-orange-700 border-orange-200`}>
                    <CircleAlert className="w-3 h-3" />
                    <span className="ml-1">No Leadership</span>
                  </span>
                ) : (
                  <span className={`${badgeBase} bg-green-50 text-green-700 border-green-200`}>
                    <UserCheck className="w-3 h-3" />
                    <span className="ml-1">{b.leaders} Leaders</span>
                  </span>
                )}
                {/* Graduated badge */}
                {b.graduated !== null && (
                  <span className={`${badgeBase} bg-purple-50 text-purple-700 border-purple-200`}>
                    <Award className="w-3 h-3" />
                    <span className="ml-1">{b.graduated} Graduated</span>
                  </span>
                )}
              </div>
              <button className={viewBtnClass} onClick={() => router.push(`/dashboard/classes/${b.id}`)}>
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  function renderEtsCard(b: EtsBatch) {
    return (
      <div
        key={b.id}
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
      >
        <CardContent className="p-4 pb-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-[#222B45]">{b.id}</h3>
                    <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-purple-50 text-purple-700 border-purple-200 items-center text-xs">
                      <Sparkles className="w-3 h-3 text-purple-600 mr-1" />
                      Auto-Created
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#8F9BB3]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{b.month} {b.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{b.dateRange}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                    <EllipsisVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/${b.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Batch Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/${b.id}/edit`)}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Edit Batch Leadership
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Enrollment progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-[#222B45]">Members Enrolled</h3>
                  </div>
                  <span className="text-xs text-[#8F9BB3]">{b.enrolled} / {b.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${b.enrolledColor} h-2 rounded-full`} style={{ width: `${b.enrolledPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Pending Approvals + Band Eligible */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardCheck className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Pending Approvals</span>
                </div>
                <p className="text-2xl font-semibold text-orange-700">{b.pendingApprovals}</p>
                <p className="text-xs text-orange-600 mt-1">All processed</p>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Music className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-900">Band Eligible</span>
                </div>
                <p className="text-2xl font-semibold text-teal-700">{b.bandEligible}</p>
                <p className="text-xs text-teal-600 mt-1">{b.bandEligibleLabel}</p>
              </div>
            </div>

            {/* Completion progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-medium text-[#222B45]">Completion Progress</h3>
                  </div>
                  <span className="text-xs text-[#8F9BB3]">{b.completionPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${b.completionColor} h-2 rounded-full`} style={{ width: `${b.completionPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Footer badges */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EDF1F7]">
              <div className="flex items-center gap-2 flex-wrap">
                {b.status === "Not Started" && (
                  <span className={`${badgeBase} bg-gray-50 text-gray-700 border-gray-200`}>
                    <Calendar className="w-3 h-3" />
                    <span className="ml-1">Not Started</span>
                  </span>
                )}
                {b.status === "In Progress" && (
                  <span className={`${badgeBase} bg-blue-50 text-blue-700 border-blue-200`}>
                    <Clock className="w-3 h-3" />
                    <span className="ml-1">In Progress</span>
                  </span>
                )}
                {b.status === "Completed" && (
                  <span className={`${badgeBase} bg-green-50 text-green-700 border-green-200`}>
                    <CircleCheckBig className="w-3 h-3" />
                    <span className="ml-1">Completed</span>
                  </span>
                )}
                {b.leaders === null ? (
                  <span className={`${badgeBase} bg-orange-50 text-orange-700 border-orange-200`}>
                    <CircleAlert className="w-3 h-3" />
                    <span className="ml-1">No Leadership</span>
                  </span>
                ) : (
                  <span className={`${badgeBase} bg-green-50 text-green-700 border-green-200`}>
                    <UserCheck className="w-3 h-3" />
                    <span className="ml-1">{b.leaders} Leaders</span>
                  </span>
                )}
                {b.graduated !== null && (
                  <span className={`${badgeBase} bg-purple-50 text-purple-700 border-purple-200`}>
                    <Award className="w-3 h-3" />
                    <span className="ml-1">{b.graduated} Graduated</span>
                  </span>
                )}
              </div>
              <button className={viewBtnClass} onClick={() => router.push(`/dashboard/classes/${b.id}`)}>
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  //Render

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[#222B45] mb-2">Class Management</h1>
            <p className="text-[#8F9BB3]">Member training and integration lifecycle</p>
          </div>
        </div>
        {(activeTab === "baptismal Class" || activeTab === "ETS Class") && (
          <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <div className="bg-[#F7F9FC] p-1 rounded-lg inline-flex">
          {(["Pre-Youth Class", "baptismal Class", "ETS Class"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-2 px-4 py-2 ${activeTab === tab ? "text-[#009AF4]" : "text-[#8F9BB3]"}`}
            >
              {tab === "Pre-Youth Class" && <Users className="w-4 h-4" />}
              {tab === "baptismal Class" && <BookOpen className="w-4 h-4" />}
              {tab === "ETS Class" && <Church className="w-4 h-4" />}
              {tab}
              <span className={`absolute left-0 bottom-0 h-[2px] bg-[#009AF4] w-full ${activeTab === tab ? "" : "hidden"}`} />
            </button>
          ))}
        </div>

        <div className="mt-4">

          {/* PRE-YOUTH TAB */}
          {activeTab === "Pre-Youth Class" && (
            <CardContent className="p-1">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">Active Batches</p>
                        <p className="text-3xl font-semibold text-[#222B45]">1</p>
                        <div className="mt-4 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">Currently Running</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">Members in Class</p>
                        <p className="text-3xl font-semibold text-[#222B45]">64</p>
                        <div className="mt-4 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600" />
                          <span className="text-xs">Active enrolment</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">Ready for Graduation</p>
                        <p className="text-3xl font-semibold text-[#222B45]">12</p>
                        <div className="mt-4 flex items-center gap-1">
                          <Award className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-purple-600">Completed requirements</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#8F9BB3] mb-1">Pending Approvals</p>
                        <p className="text-3xl font-semibold text-[#222B45]">3</p>
                        <div className="mt-4 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span className="text-xs text-orange-600">Awaiting review</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info banner */}
              <Card className="rounded-lg border-blue-200 bg-blue-50 shadow-sm mt-4">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <CircleAlert className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 pl-3">
                      <h1 className="text-sm font-semibold text-blue-900 mb-1">Automatic Batch Creation</h1>
                      <p className="text-sm text-blue-700">
                        Pre-Youth Class batches are automatically created annually. Manual batch creation is not required for this class type.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pre-Youth batch list — kept as original hardcoded cards */}
              <div className="flex items-center justify-between mb-4 mt-4">
                <h2 className="text-lg font-semibold text-[#222B45]">Pre-Youth Class Batches</h2>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center">
                  2 Batches
                </span>
              </div>

              {/* 2025 batch */}
              <div className="space-y-8">
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-[#222B45]">2025</h3>
                    </div>
                    <div className="flex-1 h-px bg-[#EDF1F7]" />
                    <span className="text-sm text-[#8F9BB3]">1 Batch</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {/* hardcoded Pre-Youth 2025 card unchanged */}
                    <div className="bg-card text-card-foreground flex flex-col lg:flex-row lg:items-center gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-all hover:border-[#009AF4]/30">
                      <div className="flex-1 space-y-4 mt-4 ml-4 mb-4">
                        <div className="flex justify-between gap-4">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#222B45] mb-2 truncate">Pre-Youth Class 2025</h4>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8">
                                <EllipsisVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/2025`)}>
                                <Eye className="w-4 h-4 mr-2" />View Batch
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/2025/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />Edit Batch
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600 border-t" onClick={() => alert("Archive functionality coming soon")}>
                                <Archive className="w-4 h-4 mr-2" />Archive Batch
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mr-3">
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Members</span></div>
                            <p className="text-lg font-semibold text-[#222B45]">64</p><p className="text-xs text-[#8F9BB3] mt-0.5">of 80</p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><UserCheck className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Leadership</span></div>
                            <div className="flex items-center gap-2 mt-1"><CircleAlert className="w-4 h-4 text-orange-700" /><span className="text-sm font-medium text-orange-700">Pending</span></div>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Ready to Graduate</span></div>
                            <p className="text-lg font-semibold text-[#222B45]">12</p><p className="text-xs text-[#8F9BB3] mt-0.5">19% ready</p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Completion</span></div>
                            <p className="text-lg font-semibold text-[#222B45]">35%</p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#009AF4]" style={{ width: "35%" }} /></div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]"><Calendar className="w-4 h-4" /><span>Jan 5, 2025 → Nov 30, 2025</span></div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]"><UserCheck className="w-4 h-4" /><span>Sister Abena Kofi</span></div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]"><TrendingUp className="w-4 h-4" /><span>77% attendance</span></div>
                        </div>
                      </div>
                      <div className="lg:w-48 flex lg:flex-col items-center lg:items-stretch gap-3 lg:gap-4 ml-4 mr-4 mb-4">
                        <div className="flex-1 lg:flex-none">
                          <div className="p-4 bg-white border-2 border-dashed rounded-lg text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center"><CircleAlert className="w-3 h-3" /></div>
                              <div><p className="text-xs text-[#8F9BB3]">Readiness Status</p><span className="text-xs font-medium text-red-600">Low Readiness</span></div>
                            </div>
                          </div>
                        </div>
                        <button className="inline-flex items-center flex-1 lg:flex-none h-9 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm font-medium justify-center">
                          <Eye className="w-4 h-4 mr-2" />View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2024 batch */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-[#222B45]">2024</h3>
                    </div>
                    <div className="flex-1 h-px bg-[#EDF1F7]" />
                    <span className="text-sm text-[#8F9BB3]">1 Batch</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-card text-card-foreground flex flex-col lg:flex-row lg:items-center gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-all hover:border-[#009AF4]/30">
                      <div className="flex-1 space-y-4 mt-4 ml-4 mb-4">
                        <div className="flex justify-between gap-4">
                          <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center"><Users className="w-5 h-5 text-purple-600" /></div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#222B45] mb-2 truncate">Pre-Youth Class 2024</h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                                  <Award className="w-3 h-3" /><span>Completed</span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                                  <Calendar className="w-3 h-3" /><span>2024</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="inline-flex items-center mr-2 justify-center transition-all hover:bg-accent rounded-md h-8 w-8"><EllipsisVertical className="w-4 h-4" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/2024`)}><Eye className="w-4 h-4 mr-2" />View Batch</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/classes/2024/edit`)}><Edit className="w-4 h-4 mr-2" />Edit Batch</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600 border-t"><Archive className="w-4 h-4 mr-2" />Archive Batch</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mr-3">
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Members</span></div>
                            <p className="text-lg font-semibold text-[#222B45]">58</p><p className="text-xs text-[#8F9BB3] mt-0.5">of 70</p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><UserCheck className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Leadership</span></div>
                            <div className="flex items-center gap-2 mt-1"><CheckCircle className="w-4 h-4 text-green-700" /><span className="text-sm font-medium text-green-700">Assigned</span></div>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Ready to Graduate</span></div>
                            <p className="text-lg font-semibold text-[#222B45]">58</p><p className="text-xs text-[#8F9BB3] mt-0.5">100% ready</p>
                          </div>
                          <div className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1"><Target className="w-4 h-4 text-blue-600" /><span className="text-xs text-[#8F9BB3]">Completion</span></div>
                            <p className="text-lg font-semibold text-[#222B45]">100%</p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#009AF4]" style={{ width: "100%" }} /></div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#EDF1F7]">
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]"><Calendar className="w-4 h-4" /><span>Jan 8, 2024 → Nov 25, 2024</span></div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]"><UserCheck className="w-4 h-4" /><span>Sister Ama Ofori</span></div>
                          <div className="flex items-center gap-2 text-sm text-[#8F9BB3]"><TrendingUp className="w-4 h-4" /><span>91% attendance</span></div>
                        </div>
                      </div>
                      <div className="lg:w-48 flex lg:flex-col items-center lg:items-stretch gap-3 lg:gap-4 ml-4 mr-4 mb-4">
                        <div className="flex-1 lg:flex-none">
                          <div className="p-4 bg-white border-2 border-dashed rounded-lg text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center"><CheckCircle className="w-3 h-3" /></div>
                              <div><p className="text-xs text-[#8F9BB3]">Readiness Status</p><span className="text-xs font-medium text-green-600">High Readiness</span></div>
                            </div>
                          </div>
                        </div>
                        <button className="inline-flex items-center flex-1 lg:flex-none h-9 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm font-medium justify-center">
                          <Eye className="w-4 h-4 mr-2" />View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {/*BAPTISMAL TAB*/}
          {activeTab === "baptismal Class" && (
            <CardContent className="p-4">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Batches", value: 2, sub: "Currently Running", subColor: "text-green-600", icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: "bg-green-50" },
                  { label: "Members in Class", value: 45, sub: "Active enrolment", subColor: "", icon: <Users className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50" },
                  { label: "Ready for Graduation", value: 38, sub: "Completed requirements", subColor: "text-purple-600", icon: <Award className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50" },
                  { label: "Pending Approvals", value: 7, sub: "Awaiting review", subColor: "text-orange-600", icon: <Clock className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50" },
                ].map((s) => (
                  <Card key={s.label} className="bg-card flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#8F9BB3] mb-1">{s.label}</p>
                          <p className="text-3xl font-semibold text-[#222B45]">{s.value}</p>
                          <div className="mt-4 flex items-center gap-1">
                            <span className={`text-xs ${s.subColor}`}>{s.sub}</span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 mt-4">
                <h2 className="text-lg font-semibold text-[#222B45]">Baptismal Class Batches</h2>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-xs">
                  {baptismalJanBatches.length + baptismalAugBatches.length} Batches
                </span>
              </div>

              <Card className="rounded-lg border-blue-200 bg-blue-50 shadow-sm">
                <CardContent className="p-1">
                  <div className="flex items-start justify-between pl-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <CircleAlert className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 pl-3">
                      <h1 className="text-sm font-semibold text-blue-900 mb-1">System-Managed Batches</h1>
                      <p className="text-sm text-blue-700">
                        Baptismal Class batches are automatically created by the system for January and August intake periods. Batches cannot be deleted but leadership and member assignments can be managed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search + filter */}
              <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-4 items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <Input
                    placeholder="Search batches by name or month..."
                    value={baptismalSearch}
                    onChange={(e) => setBaptismalSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-[#EDF1F7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Funnel className="w-4 h-4 mr-1" />
                  <select
                    value={baptismalYear}
                    onChange={(e) => setBaptismalYear(e.target.value)}
                    className="rounded-lg border border-[#EDF1F7] focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3"
                  >
                    <option value="">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              {/* January Batches */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#222B45]">January Batches</h2>
                    <p className="text-sm text-[#8F9BB3]">First semester intake (January - May)</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-sm">
                  {filteredBcJan.length} Batches
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredBcJan.length > 0
                  ? filteredBcJan.map(renderBaptismalCard)
                  : <p className="text-sm text-[#8F9BB3] col-span-2">No batches match your search.</p>}
              </div>

              {/* August Batches */}
              <div className="flex items-center justify-between mb-4 mt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#222B45]">August Batches</h2>
                    <p className="text-sm text-[#8F9BB3]">Second semester intake (August - December)</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-sm">
                  {filteredBcAug.length} Batches
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredBcAug.length > 0
                  ? filteredBcAug.map(renderBaptismalCard)
                  : <p className="text-sm text-[#8F9BB3] col-span-2">No batches match your search.</p>}
              </div>
            </CardContent>
          )}

          {/*ETS TAB*/}
          {activeTab === "ETS Class" && (
            <CardContent className="p-4">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Batches", value: 2, sub: "Currently Running", subColor: "text-green-600", icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: "bg-green-50" },
                  { label: "Members in Class", value: 32, sub: "Active enrolment", subColor: "", icon: <Users className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50" },
                  { label: "Ready for Graduation", value: 0, sub: "Completed requirements", subColor: "text-purple-600", icon: <Award className="w-6 h-6 text-purple-600" />, bg: "bg-purple-50" },
                  { label: "Pending Approvals", value: 5, sub: "Awaiting review", subColor: "text-orange-600", icon: <Clock className="w-6 h-6 text-orange-600" />, bg: "bg-orange-50" },
                ].map((s) => (
                  <Card key={s.label} className="bg-card flex flex-col gap-6 rounded-xl border border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#8F9BB3] mb-1">{s.label}</p>
                          <p className="text-3xl font-semibold text-[#222B45]">{s.value}</p>
                          <div className="mt-4 flex items-center gap-1">
                            <span className={`text-xs ${s.subColor}`}>{s.sub}</span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-lg ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 mt-4">
                <h2 className="text-lg font-semibold text-[#222B45]">ETS Class Batches</h2>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-blue-50 text-blue-700 border-blue-200 items-center text-xs">
                  {etsJanBatches.length + etsAugBatches.length} Batches
                </span>
              </div>

              <Card className="rounded-lg border-green-200 bg-green-50 shadow-sm">
                <CardContent className="p-1">
                  <div className="flex items-start justify-between pl-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <CircleAlert className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 pl-3">
                      <h1 className="text-sm font-semibold text-green-900 mb-1">System-Managed Batches</h1>
                      <p className="text-xs text-green-700">
                        ETS (Establishment) Class batches are automatically created by the system for January and August intake periods. Batches cannot be deleted but leadership and member assignments can be managed. Track band eligibility and approval status for each batch.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search + filter */}
              <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-4 items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <Input
                    placeholder="Search batches by name or month..."
                    value={etsSearch}
                    onChange={(e) => setEtsSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-[#EDF1F7] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Funnel className="w-4 h-4 mr-1" />
                  <select
                    value={etsYear}
                    onChange={(e) => setEtsYear(e.target.value)}
                    className="rounded-lg border border-[#EDF1F7] focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-3"
                  >
                    <option value="">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              {/* January Batches */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#222B45]">January Batches</h2>
                    <p className="text-sm text-[#8F9BB3]">First semester intake (January - June)</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-green-50 text-green-700 border-green-200 items-center text-sm">
                  {filteredEtsJan.length} Batches
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredEtsJan.length > 0
                  ? filteredEtsJan.map(renderEtsCard)
                  : <p className="text-sm text-[#8F9BB3] col-span-2">No batches match your search.</p>}
              </div>

              {/* August Batches */}
              <div className="flex items-center justify-between mb-4 mt-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#222B45]">August Batches</h2>
                    <p className="text-sm text-[#8F9BB3]">Second semester intake (August - December)</p>
                  </div>
                </div>
                <span className="inline-flex px-2 py-0.5 font-medium justify-center rounded-md border bg-green-50 text-green-700 border-green-200 items-center text-sm">
                  {filteredEtsAug.length} Batches
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredEtsAug.length > 0
                  ? filteredEtsAug.map(renderEtsCard)
                  : <p className="text-sm text-[#8F9BB3] col-span-2">No batches match your search.</p>}
              </div>
            </CardContent>
          )}

        </div>
      </div>
    </div>
  );
}