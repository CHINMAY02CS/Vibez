import DashboardHeader from "@/templates/DashboardHeader";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full p-4 bg-white shadow-sm h-15">
        <DashboardHeader />
      </div>
      <div className="min-h-screen px-2 mt-15 md:py-4 md:px-0 bg-teal-50">
        <Outlet />
      </div>
    </>
  );
}
