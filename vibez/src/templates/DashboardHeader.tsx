import { Link, useLocation, useNavigate } from "react-router-dom";
import VibezLogo from "@/assets/VibezLogo.png";
import { useEffect } from "react";
export default function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
    console.log(token);
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between lg:px-8">
      <img src={VibezLogo} alt="logo" className="h-8 max-w-max" />
      <div className="flex items-center gap-x-8">
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/create-post">Create Post</Link>
      </div>
    </div>
  );
}
