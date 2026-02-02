import {
  House,
  Users,
  Music,
  Grid3x3,
  GraduationCap,
  Crown,
  UsersRound,
  ClipboardCheck,
  ChartBar,
  Settings,
} from "lucide-react";

export const navItems = [
  { name: "Dashboard", link: "/", icon: House },
  { name: "Members", link: "members", icon: Users },
  { name: "Bands", link: "bands", icon: Music },
  { name: "Units", link: "units", icon: Grid3x3 },
  { name: "Classes", link: "classes", icon: GraduationCap },
  { name: "Leadership", link: "leadership", icon: Crown },
  { name: "Committees", link: "committees", icon: UsersRound },
  { name: "Attendance", link: "attendance", icon: ClipboardCheck },
  { name: "Reports", link: "reports", icon: ChartBar },
  { name: "Settings", link: "settings", icon: Settings },
];
