import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import GlobalLoading from "@/components/loading/GlobalLoading";
import AppErrorBoundary from "@/components/error/AppErrorBoundary";

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <Suspense fallback={<GlobalLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppErrorBoundary>
  );
};

export default App;