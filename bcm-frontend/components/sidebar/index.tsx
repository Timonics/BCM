"use client";

import { churchInfo } from "@/data/church-info";
import {
  House,
  Users,
  Music,
  Briefcase,
  Grid3x3,
  Crown,
  GraduationCap,
  UsersRound,
  ClipboardCheck,
  ChartBar,
  Settings,
  Cross,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  activeItem,
  setActiveItem,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: House },
    { name: "Members", icon: Users },
    { name: "Bands", icon: Music },
    { name: "Departments", icon: Briefcase },
    { name: "Units", icon: Grid3x3 },
    { name: "Leadership", icon: Crown },
    { name: "Classes", icon: GraduationCap },
    { name: "Committees", icon: UsersRound },
    { name: "Attendance", icon: ClipboardCheck },
    { name: "Reports", icon: ChartBar },
    { name: "Settings", icon: Settings },
  ];

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-[#EDF1F7] shadow-sm
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-20" : "w-64"}
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#EDF1F7]">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                {churchInfo.logoUrl ? (
                  <img
                    src={churchInfo.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Cross className="w-5 h-5 text-[#009AF4]" />
                )}
              </div>
              <div>
                <h1 className="font-bold text-[#222B45] text-sm">
                  {churchInfo.name}
                </h1>
                <p className="text-xs text-[#8F9BB3]">{churchInfo.branch}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#F7F9FC] text-[#8F9BB3] transition-colors"
          >
            {isSidebarCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMobileSidebarOpen(false);
                  if (item.name === "Dashboard") {
                    router.push("/dashboard");
                  } else {
                    router.push(
                      `/dashboard/${item.name.toLowerCase().replace(/ /g, "-")}`,
                    );
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-[#009AF4] text-white shadow-lg shadow-blue-200"
                      : "text-[#8F9BB3] hover:bg-[#F7F9FC] hover:text-[#222B45]"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-[#EDF1F7]">
          <button
            //   onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}
