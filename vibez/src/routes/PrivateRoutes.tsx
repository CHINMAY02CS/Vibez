import Dashboard from "@/layout/Dashboard";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";

export default function PrivateRoutes() {
  return {
    path: "/",
    element: <Dashboard />,
    children: [
      { path: "home", element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  };
}
