"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  Music,
  Crown,
  UserCheck,
  GraduationCap,
  Calendar,
  Clock,
  AlertCircle,
  Settings,
  ChartBar,
  ClipboardCheck,
  BarChart3,
  Bell,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const stats = [
    {
      label: "Total Members",
      value: "1,284",
      change: "+12%",
      color: "blue",
      icon: Users,
      trend: "up",
    },
    {
      label: "Active Bands",
      value: "24",
      change: "+3",
      color: "purple",
      icon: Music,
      trend: "up",
    },
    {
      label: "Leadership Roles",
      value: "156",
      change: "+8",
      color: "orange",
      icon: Crown,
      trend: "up",
    },
    {
      label: "Avg. Attendance",
      value: "94%",
      change: "+2%",
      color: "green",
      icon: UserCheck,
      trend: "up",
    },
  ];

  const recentActivity = [
    {
      title: "New Member Added",
      description: "Sarah Johnson joined Youth Band",
      time: "2 hours ago",
      icon: Users,
      color: "blue",
    },
    {
      title: "Leadership Change",
      description: "Michael Chen appointed as Choir Band Leader",
      time: "5 hours ago",
      icon: Crown,
      color: "orange",
    },
    {
      title: "Class Completed",
      description: "12 members completed Baptismal Class",
      time: "1 day ago",
      icon: GraduationCap,
      color: "green",
    },
    {
      title: "Committee Meeting",
      description: "Youth Program committee meeting scheduled",
      time: "2 days ago",
      icon: Calendar,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <main
        className={`
          flex-1 transition-all duration-300
          ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <Header
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          activeItem={activeItem}
        />

        <div>
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const iconBgClass =
                  stat.color === "blue"
                    ? "bg-blue-50"
                    : stat.color === "purple"
                      ? "bg-purple-50"
                      : stat.color === "orange"
                        ? "bg-orange-50"
                        : "bg-green-50";
                const iconColorClass =
                  stat.color === "blue"
                    ? "text-blue-600"
                    : stat.color === "purple"
                      ? "text-purple-600"
                      : stat.color === "orange"
                        ? "text-orange-600"
                        : "text-green-600";
                return (
                  <Card
                    key={index}
                    className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div
                          className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}
                        >
                          <Icon
                            className={`w-5 h-5 md:w-6 md:h-6 ${iconColorClass}`}
                          />
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                      flex items-center gap-1 text-xs
                      ${stat.color === "blue" ? "text-blue-600 border-blue-200 bg-blue-50" : ""}
                      ${stat.color === "purple" ? "text-purple-600 border-purple-200 bg-purple-50" : ""}
                      ${stat.color === "orange" ? "text-orange-600 border-orange-200 bg-orange-50" : ""}
                      ${stat.color === "green" ? "text-green-600 border-green-200 bg-green-50" : ""}
                    `}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-[#8F9BB3] mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-[#222B45]">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Welcome Card */}
              <Card className="border-[#EDF1F7] shadow-sm">
                <CardHeader className="border-b border-[#EDF1F7] bg-[#F7F9FC] p-4 md:p-6">
                  <CardTitle className="text-base md:text-lg">
                    Welcome to BCM Manager
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your comprehensive church administration system
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    <p className="text-sm md:text-base text-[#8F9BB3]">
                      This dashboard provides you with an overview of your
                      church's operations. Use the sidebar to navigate to
                      different sections and manage your church efficiently.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-[#8F9BB3] mb-1">
                          Active Today
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[#009AF4]">
                          342
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-[#8F9BB3] mb-1">This Week</p>
                        <p className="text-lg md:text-xl font-bold text-green-600">
                          1,156
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-[#EDF1F7] shadow-sm">
                <CardHeader className="border-b border-[#EDF1F7] bg-[#F7F9FC] p-4 md:p-6">
                  <CardTitle className="text-base md:text-lg">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Latest updates from your church
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      const iconBgClass =
                        activity.color === "blue"
                          ? "bg-blue-50"
                          : activity.color === "orange"
                            ? "bg-orange-50"
                            : activity.color === "green"
                              ? "bg-green-50"
                              : "bg-purple-50";
                      const iconColorClass =
                        activity.color === "blue"
                          ? "text-blue-600"
                          : activity.color === "orange"
                            ? "text-orange-600"
                            : activity.color === "green"
                              ? "text-green-600"
                              : "text-purple-600";
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBgClass}`}
                          >
                            <Icon className={`w-4 h-4 ${iconColorClass}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#222B45]">
                              {activity.title}
                            </p>
                            <p className="text-xs text-[#8F9BB3]">
                              {activity.description}
                            </p>
                            <p className="text-xs text-[#8F9BB3] mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-[#EDF1F7] shadow-sm">
              <CardHeader className="border-b border-[#EDF1F7] bg-[#F7F9FC]">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#009AF4]" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[#EDF1F7] hover:border-[#009AF4] hover:bg-blue-50"
                  >
                    <Users className="w-5 h-5 text-[#009AF4]" />
                    <span className="text-sm">Add Member</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[#EDF1F7] hover:border-[#009AF4] hover:bg-blue-50"
                  >
                    <ClipboardCheck className="w-5 h-5 text-[#009AF4]" />
                    <span className="text-sm">Take Attendance</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[#EDF1F7] hover:border-[#009AF4] hover:bg-blue-50"
                  >
                    <ChartBar className="w-5 h-5 text-[#009AF4]" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[#EDF1F7] hover:border-[#009AF4] hover:bg-blue-50"
                  >
                    <Settings className="w-5 h-5 text-[#009AF4]" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alerts & Notifications */}
            <Card className="border-[#EDF1F7] shadow-sm">
              <CardHeader className="border-b border-[#EDF1F7] bg-[#F7F9FC]">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#009AF4]" />
                      Alerts & Notifications
                    </CardTitle>
                    <CardDescription>
                      Recent system alerts and important notifications
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* High Priority Alert */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50/50">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#222B45]">
                          Leadership Term Expiring Soon
                        </p>
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-200 bg-red-50"
                        >
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-xs text-[#8F9BB3] mb-2">
                        Michael Chen's tenure as Choir Band Leader expires in 7
                        days. Please review and assign a successor.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3]">
                          <Clock className="w-3 h-3" />2 hours ago • Jan 31,
                          2026, 10:15 AM
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Medium Priority Alert */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-orange-200 bg-orange-50/50">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#222B45]">
                          New Member Pending Verification
                        </p>
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200 bg-orange-50"
                        >
                          Medium
                        </Badge>
                      </div>
                      <p className="text-xs text-[#8F9BB3] mb-2">
                        Sarah Johnson has been added to the Youth Band. Profile
                        verification is pending.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3]">
                          <Clock className="w-3 h-3" />5 hours ago • Jan 31,
                          2026, 7:20 AM
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Info Alert */}
                  <div className="flex items-start gap-3 p-4 rounded-lg border border-green-200 bg-green-50/50">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#222B45]">
                          Baptismal Class Completed
                        </p>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          Success
                        </Badge>
                      </div>
                      <p className="text-xs text-[#8F9BB3] mb-2">
                        12 members have successfully completed the Baptismal
                        Class. Certificates are ready for distribution.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3]">
                          <Clock className="w-3 h-3" />1 day ago • Jan 30, 2026,
                          2:00 PM
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
