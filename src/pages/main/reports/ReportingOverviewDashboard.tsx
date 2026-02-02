import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Crown,
  Music,
  Grid3x3,
  GraduationCap,
  UsersRound,
  ClipboardCheck,
  TrendingUp,
  Download,
  Eye,
  BarChart3,
  ArrowRight,
  Calendar,
  Target,
  PieChart,
  Sheet,
} from "lucide-react";

interface ReportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBgColor: string;
  reportCount: number;
}

interface SummaryCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBgColor: string;
}

interface ReportingOverviewDashboardProps {
  onNavigateToCategory?: (categoryId: string) => void;
}

export default function ReportingOverviewDashboard({
  onNavigateToCategory,
}: ReportingOverviewDashboardProps) {
  // Summary statistics
  const summaryStats: SummaryCard[] = [
    {
      title: "Total Members",
      value: "2,847",
      subtitle: "Active members registered",
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-50",
    },
    {
      title: "Active Leaders",
      value: "156",
      subtitle: "Across all units and committees",
      icon: Crown,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-50",
    },
    {
      title: "Active Bands and Units",
      value: "24",
      subtitle: "12 bands • 12 units",
      icon: Grid3x3,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-50",
    },
    {
      title: "Attendance Records",
      value: "1,248",
      subtitle: "Total records this year",
      icon: ClipboardCheck,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-50",
    },
  ];

  // Report categories
  const reportCategories: ReportCategory[] = [
    {
      id: "membership",
      title: "Membership Reports",
      description:
        "Member directories, demographics, contact lists, birthday reports, and membership statistics",
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-50",
      reportCount: 8,
    },
    {
      id: "band-unit",
      title: "Band and Unit Reports",
      description:
        "Band rosters, unit member lists, participation statistics, and organizational structure",
      icon: Music,
      iconColor: "text-indigo-600",
      iconBgColor: "bg-indigo-50",
      reportCount: 6,
    },
    {
      id: "leadership",
      title: "Leadership Reports",
      description:
        "Leadership roster, tenure tracking, expiring terms, succession planning, and audit logs",
      icon: Crown,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-50",
      reportCount: 7,
    },
    {
      id: "class",
      title: "Class Reports",
      description:
        "Pre-Youth, Baptismal, and ETS class reports, batch statistics, graduation records",
      icon: GraduationCap,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-50",
      reportCount: 5,
    },
    {
      id: "committee",
      title: "Committee Reports",
      description:
        "Committee rosters, meeting attendance, project reports, and performance metrics",
      icon: UsersRound,
      iconColor: "text-teal-600",
      iconBgColor: "bg-teal-50",
      reportCount: 6,
    },
    {
      id: "attendance",
      title: "Attendance Reports",
      description:
        "Service attendance, trends analysis, comparative reports, and attendance statistics",
      icon: ClipboardCheck,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-50",
      reportCount: 9,
    },
  ];

  const handleViewReports = (categoryId: string) => {
    if (onNavigateToCategory) {
      onNavigateToCategory(categoryId);
    } else {
      console.log("Navigate to category:", categoryId);
      alert(`View ${categoryId} reports`);
    }
  };

  const handleExportAll = () => {
    console.log("Export all reports");
    alert("Export all available reports to PDF/CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[#222B45] mb-2">
              Reports
            </h1>
            <p className="text-[#8F9BB3]">Data insights and exports</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#EDF1F7]"
            onClick={handleExportAll}
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-[#EDF1F7] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#8F9BB3] mb-1">{stat.title}</p>
                    <p className="text-3xl font-semibold text-[#222B45] mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#8F9BB3]">{stat.subtitle}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.iconBgColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-[#8F9BB3]">Last Report Generated</p>
                <p className="font-semibold text-[#222B45]">Today, 09:45 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-[#8F9BB3]">Reports This Month</p>
                <p className="font-semibold text-[#222B45]">42 Generated</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-[#8F9BB3]">Most Generated</p>
                <p className="font-semibold text-[#222B45]">
                  Attendance Reports
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-[#8F9BB3]">Total Exports</p>
                <p className="font-semibold text-[#222B45]">156 This Year</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#222B45] mb-1">
            Report Categories
          </h2>
          <p className="text-sm text-[#8F9BB3]">
            Browse and generate reports by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${category.iconBgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {category.reportCount}{" "}
                      {category.reportCount === 1 ? "report" : "reports"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-[#222B45]">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#8F9BB3] mb-4 min-h-15">
                    {category.description}
                  </p>
                  <Button
                    onClick={() => handleViewReports(category.id)}
                    variant="outline"
                    className="w-full border-[#EDF1F7] hover:bg-[#F7F9FC] hover:border-[#009AF4] hover:text-[#009AF4]"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Reports
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access Reports */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#222B45]">
                Quick Access Reports
              </CardTitle>
              <p className="text-sm text-[#8F9BB3] mt-1">
                Frequently used and recently generated reports
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Report 1 */}
            <div className="p-4 border border-[#EDF1F7] rounded-lg hover:bg-[#F7F9FC] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Popular
                </Badge>
              </div>
              <h4 className="font-semibold text-[#222B45] mb-1">
                Member Directory
              </h4>
              <p className="text-xs text-[#8F9BB3] mb-3">
                Complete list of all active members
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#EDF1F7] text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EDF1F7] text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Quick Report 2 */}
            <div className="p-4 border border-[#EDF1F7] rounded-lg hover:bg-[#F7F9FC] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-orange-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Popular
                </Badge>
              </div>
              <h4 className="font-semibold text-[#222B45] mb-1">
                Attendance Summary
              </h4>
              <p className="text-xs text-[#8F9BB3] mb-3">
                Monthly attendance statistics and trends
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#EDF1F7] text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EDF1F7] text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Quick Report 3 */}
            <div className="p-4 border border-[#EDF1F7] rounded-lg hover:bg-[#F7F9FC] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Recent
                </Badge>
              </div>
              <h4 className="font-semibold text-[#222B45] mb-1">
                Leadership Roster
              </h4>
              <p className="text-xs text-[#8F9BB3] mb-3">
                Current leaders with tenure information
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#EDF1F7] text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EDF1F7] text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Quick Report 4 */}
            <div className="p-4 border border-[#EDF1F7] rounded-lg hover:bg-[#F7F9FC] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Recent
                </Badge>
              </div>
              <h4 className="font-semibold text-[#222B45] mb-1">
                Class Enrollment
              </h4>
              <p className="text-xs text-[#8F9BB3] mb-3">
                Active batches and student statistics
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#EDF1F7] text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EDF1F7] text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Quick Report 5 */}
            <div className="p-4 border border-[#EDF1F7] rounded-lg hover:bg-[#F7F9FC] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Music className="w-5 h-5 text-indigo-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  New
                </Badge>
              </div>
              <h4 className="font-semibold text-[#222B45] mb-1">
                Band Participation
              </h4>
              <p className="text-xs text-[#8F9BB3] mb-3">
                Band membership and activity levels
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#EDF1F7] text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EDF1F7] text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Quick Report 6 */}
            <div className="p-4 border border-[#EDF1F7] rounded-lg hover:bg-[#F7F9FC] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <UsersRound className="w-5 h-5 text-teal-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  New
                </Badge>
              </div>
              <h4 className="font-semibold text-[#222B45] mb-1">
                Committee Overview
              </h4>
              <p className="text-xs text-[#8F9BB3] mb-3">
                All committees and their members
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-[#EDF1F7] text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#EDF1F7] text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types Info */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#222B45]">
            Available Report Types
          </CardTitle>
          <p className="text-sm text-[#8F9BB3] mt-1">
            All reports can be exported in multiple formats
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#222B45] mb-1">
                  PDF Reports
                </h4>
                <p className="text-sm text-[#8F9BB3] mb-2">
                  Professional formatted documents for printing and sharing
                </p>
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  Print-ready
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <Sheet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#222B45] mb-1">Excel/CSV</h4>
                <p className="text-sm text-[#8F9BB3] mb-2">
                  Spreadsheet formats for data analysis and manipulation
                </p>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  Data analysis
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#222B45] mb-1">
                  Interactive Charts
                </h4>
                <p className="text-sm text-[#8F9BB3] mb-2">
                  Visual representations with drill-down capabilities
                </p>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  Visual insights
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
