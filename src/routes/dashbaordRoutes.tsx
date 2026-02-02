import type { RouteObject } from "react-router";
import { ProtectedRoutes } from "@/components/protected-routes/ProtectedRoutes";
import DashboardLayout from "@/layouts/DashboardLayout";
import { lazy } from "react";

// Create lazy components
const DashboardPage = lazy(() => import("@/pages/main/dashboard"));
const AllMembers = lazy(() => import("@/pages/main/members/AllMembers"));
const AddMember = lazy(() => import("@/pages/main/members/AddMember"));
const EditMember = lazy(() => import("@/pages/main/members/EditMember"));
const AllBands = lazy(() => import("@/pages/main/bands/AllBands"));
const AllUnits = lazy(() => import("@/pages/main/units/AllUnits"));
const AllClasses = lazy(() => import("@/pages/main/classes/AllClasses"));
const LeadershipConsolidationDashboard = lazy(
  () => import("@/pages/main/leadership/LeadershipConsolidationDashboard")
);
const CommitteeManagementOverview = lazy(
  () => import("@/pages/main/committees/CommiteeManagementOverview")
);
const AttendanceManagementOverview = lazy(
  () => import("@/pages/main/attendance/AttendanceManagementOverview")
);
const ReportingOverviewDashboard = lazy(
  () => import("@/pages/main/reports/ReportingOverviewDashboard")
);
const Settings = lazy(() => import("@/pages/main/settings/index"))

export const dashboardRoutes: RouteObject[] = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          // Members routes
          {
            path: "members",
            children: [
              {
                index: true,
                element: <AllMembers />,
              },
              {
                path: "add",
                element: <AddMember />,
              },
              {
                path: "edit/:projectId",
                element: <EditMember />,
              },
              // {
              //   path: "profile/:projectId",
              //   element: <MemberDetails />,
              // },
            ],
          },
          // Bands routes
          {
            path: "bands",
            children: [
              {
                index: true,
                element: <AllBands />,
              },
            ],
          },
          //   // Units routes
          {
            path: "units",
            children: [
              {
                index: true,
                element: <AllUnits />,
              },
              //
            ],
          },
          //  Classes routes
          {
            path: "classes",
            children: [
              {
                index: true,
                element: <AllClasses />,
              },
            ],
          },
          // Leadership routes
          {
            path: "leadership",
            children: [
              {
                index: true,
                element: <LeadershipConsolidationDashboard />,
              },
            ],
          },
          // Committee route
          {
            path: "committees",
            children: [
              {
                index: true,
                element: <CommitteeManagementOverview />,
              },
            ],
          },
          // Attendance route
          {
            path: "attendance",
            children: [
              {
                index: true,
                element: <AttendanceManagementOverview />,
              },
            ],
          },
          // Reports route
          {
            path: "reports",
            children: [
              {
                index: true,
                element: <ReportingOverviewDashboard />,
              },
            ],
          },
          // Settings route
          {
            path: "settings",
            children: [
              {
                index: true,
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },
];
