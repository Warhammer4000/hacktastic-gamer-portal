import {
  BarChart3,
  Calendar,
  Cpu,
  GalleryHorizontal,
  LogOut,
  Newspaper,
  Settings,
  User,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";

export const adminSidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/admin/dashboard",
  },
  {
    title: "Gallery",
    icon: GalleryHorizontal,
    path: "/admin/gallery",
  },
  {
    title: "News",
    icon: Newspaper,
    path: "/admin/news",
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/admin/events",
  },
  {
    title: "Teams",
    icon: UsersRound,
    path: "/admin/teams",
  },
  {
    title: "Mentor Approval",
    icon: UserCheck,
    path: "/admin/mentors",
  },
  {
    title: "Platform",
    icon: Cpu,
    path: "/admin/platform",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export const profileItems = [
  {
    title: "Profile",
    icon: User,
    path: "/admin/profile",
  },
  {
    title: "Logout",
    icon: LogOut,
    path: "/logout",
    className: "text-destructive hover:text-destructive",
  },
];