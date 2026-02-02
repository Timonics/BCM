import type { RouteObject } from "react-router";
import AuthLayout from "@/layouts/AuthLayout";
import { RedirectRoutes } from "@/components/protected-routes/ProtectedRoutes";

// Eager load auth components (small, critical)
// import Login from "@/components/auth/Login";
// import SuperAdminLogin from "@/components/auth/SuperAdminLogin";

export const authRoutes: RouteObject[] = [
  {
    element: <RedirectRoutes />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            // element: <Login />,
          },
          {
            path: "super-admin",
            // element: <SuperAdminLogin />,
          },
        ],
      },
    ],
  },
];