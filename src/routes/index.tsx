import type { RouteObject } from "react-router";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashbaordRoutes";

export const routes: RouteObject[] = [
  ...authRoutes,
  ...dashboardRoutes,
  // Add 404 route last
//   {
//     path: "*",
//     lazy: () => import("@/pages/NotFound"),
//   },
];