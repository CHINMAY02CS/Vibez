import DashboardHeader from "@/templates/DashboardHeader";
import { Outlet } from "react-router-dom";
import { motion } from "motion/react";

export default function Dashboard() {
  return (
    <>
      <div className="fixed inset-x-0 z-50 w-full h-16 max-w-2xl p-4 mx-auto bg-gray-900 rounded-full shadow-sm top-2">
        <DashboardHeader />
      </div>
      <div className="min-h-screen px-2 mt-20 text-white bg-gray-950 md:py-4 md:px-0">
        <Outlet />
      </div>
    </>
  );
}
