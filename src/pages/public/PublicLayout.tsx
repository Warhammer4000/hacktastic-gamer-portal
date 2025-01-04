import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Navbar />
      <main className="mt-16">
        <Outlet />
      </main>
    </div>
  );
}