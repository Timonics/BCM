"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
