import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { Outlet } from "react-router-dom";

export default function PublicRoutes() {
  return {
    path: "/",
    element: <Outlet />,
    children: [
      { path: "", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  };
}
