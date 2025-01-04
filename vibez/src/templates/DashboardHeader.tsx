import { Link } from "react-router-dom";
import VibezLogo from "@/assets/VibezLogo.png";
export default function DashboardHeader() {
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
