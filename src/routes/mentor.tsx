import { RouteObject } from "react-router-dom";
import MentorLayout from "@/pages/mentor/MentorLayout";
import MentorDashboard from "@/pages/mentor/Dashboard";
import Profile from "@/pages/mentor/Profile";
import Preferences from "@/pages/mentor/Preferences";
import Register from "@/pages/mentor/Register";
import Benefits from "@/pages/mentor/Benefits";

export const mentorRoutes: RouteObject = {
  path: "mentor",
  children: [
    {
      path: "register",
      element: <Register />,
    },
    {
      element: <MentorLayout />,
      children: [
        {
          path: "dashboard",
          element: <MentorDashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "preferences",
          element: <Preferences />,
        },
        {
          path: "benefits",
          element: <Benefits />,
        },
      ],
    },
  ],
};