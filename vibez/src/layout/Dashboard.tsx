import DashboardHeader from "@/templates/DashboardHeader";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full p-4 bg-white shadow-lg h-15">
        <DashboardHeader />
      </div>
      <div className="px-2 md:py-4 mt-18 md:px-0">
        <Outlet />
      </div>
    </>
  );
}
