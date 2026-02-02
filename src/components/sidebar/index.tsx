import { navItems } from "@/lib/navItems";
import { ChevronRight, ChevronLeft } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

type SidebarProps = {
  setActiveItem: (name: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  setActiveItem,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  return (
    <aside
      className={`hidden lg:flex flex-col bg-white text-foreground border-r border-border transition-all duration-300 ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } fixed left-0 top-0 bottom-0 z-40`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-semibold">B</span>
            </div>
            <span className="font-semibold text-foreground">BCM Manager</span>
          </div>
        )}
        {isSidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-white font-semibold">B</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            // const isActive = activeItem === item.name;
            return (
              <NavLink
                key={item.name}
                to={item.link}
                onClick={() => {
                  if (item.name === "Committees") {
                    setActiveItem("Committee Management Overview");
                  } else if (item.name === "Classes") {
                    setActiveItem("Class Management Overview");
                  } else if (item.name === "Attendance") {
                    setActiveItem("Attendance Management Overview");
                  } else if (item.name === "Reports") {
                    setActiveItem("Reporting Overview");
                  } else {
                    setActiveItem(item.name);
                  }
                }}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium ${
                    isActive
                      ? "bg-primary text-white font-semibold"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`
                }
                title={isSidebarCollapsed ? item.name : ""}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
