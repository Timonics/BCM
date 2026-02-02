import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  ChartBar,
  CircleAlert,
  ClipboardCheck,
  ClockAlert,
  Crown,
  Download,
  FileText,
  GraduationCap,
  Grid3x3,
  Music,
  TrendingUp,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Members</CardDescription>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-3xl">1,284</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Active Bands</CardDescription>
              <Music className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              8 groups active this week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Units</CardDescription>
              <Grid3x3 className="w-5 h-5 text-purple-500" />
            </div>
            <CardTitle className="text-3xl">18</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Active Classes</CardDescription>
              <GraduationCap className="w-5 h-5 text-orange-500" />
            </div>
            <CardTitle className="text-3xl">32</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              156 students enrolled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Panel */}
      <Card className="shadow-sm border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </div>
            <Badge variant="destructive" className="text-sm">
              3 alerts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Over-age Members Alert */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <TriangleAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-orange-900">
                    Over-Age Members
                  </h4>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    12 members
                  </Badge>
                </div>
                <p className="text-sm text-orange-700 mb-2">
                  Members who have exceeded the age limit for their current
                  band/unit
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Review Members
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Expired Leadership Alert */}
            <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <CircleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-red-900">
                    Expired Leadership Positions
                  </h4>
                  <Badge
                    variant="outline"
                    className="border-red-300 text-red-700"
                  >
                    5 positions
                  </Badge>
                </div>
                <p className="text-sm text-red-700 mb-2">
                  Leadership terms that have expired and need renewal or
                  replacement
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  View Leadership
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Class Completion Alert */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <ClockAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-blue-900">
                    Pending Class Completions
                  </h4>
                  <Badge
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    28 students
                  </Badge>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Students who have completed classes but certificates have not
                  been issued
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Process Completions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    New Member Added
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Johnson joined the Choir Band
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Attendance Recorded
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sunday service: 892 members present
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    5 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Class Completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Youth Leadership class finished - 24 graduates
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 day ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Leadership Appointed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Michael Chen appointed as Band Leader
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 days ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ChartBar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Report Generated
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Monthly attendance report is ready
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
            >
              <UserPlus className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Add Member</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
            >
              <ClipboardCheck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Take Attendance</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
            >
              <FileText className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Generate Report</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
            >
              <Download className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Export Data</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
            >
              <Music className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Manage Bands</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5"
            >
              <Crown className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Update Leadership</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
