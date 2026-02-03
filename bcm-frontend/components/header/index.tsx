import { Bell, Clock, Crown, GraduationCap, Menu, Users } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

interface HeaderProps {
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeItem: string;
}

export default function Header({
  setIsMobileSidebarOpen,
  activeItem,
}: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-[#EDF1F7] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F7F9FC] text-[#8F9BB3]"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-[#222B45]">{activeItem}</h2>
      </div>
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 border-b border-[#EDF1F7]">
              <h3 className="font-semibold text-[#222B45]">Notifications</h3>
              <p className="text-xs text-[#8F9BB3]">
                You have 3 unread notifications
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem
                className="p-4 border-b border-[#EDF1F7] cursor-pointer flex-col items-start gap-1"
                // onSelect={() => handleNavigate("Notifications")}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222B45]">
                      Leadership Term Expiring
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Michael Chen's tenure expires in 7 days
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3] mt-2">
                      <Clock className="w-3 h-3" />2 hours ago
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#009AF4] shrink-0" />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="p-4 border-b border-[#EDF1F7] cursor-pointer flex-col items-start gap-1"
                // onSelect={() => handleNavigate("Notifications")}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222B45]">
                      New Member Added
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      Sarah Johnson joined Youth Band
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3] mt-2">
                      <Clock className="w-3 h-3" />5 hours ago
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#009AF4] shrink-0" />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="p-4 border-b border-[#EDF1F7] cursor-pointer flex-col items-start gap-1"
                // onSelect={() => handleNavigate("Notifications")}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222B45]">
                      Class Completed
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">
                      12 members completed Baptismal Class
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3] mt-2">
                      <Clock className="w-3 h-3" />1 day ago
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#009AF4] shrink-0" />
                </div>
              </DropdownMenuItem>
            </div>
            <div className="p-3 border-t border-[#EDF1F7]">
              <Button
                variant="outline"
                className="w-full border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
                // onClick={() => handleNavigate("Notifications")}
              >
                View All Notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-[#222B45]">Admin User</p>
          <p className="text-xs text-[#8F9BB3]">Administrator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#009AF4] flex items-center justify-center text-white font-medium">
          A
        </div>
      </div>
    </header>
  );
}
