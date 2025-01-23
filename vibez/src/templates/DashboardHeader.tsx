import { Link, useLocation, useNavigate } from "react-router-dom";
import VibezLogo from "@/assets/VibezLogo.png";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/lib/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logs } from "lucide-react";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
  }, [location.pathname]);

  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/login");
  }
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center justify-between lg:px-8">
      <img src={VibezLogo} alt="logo" className="h-8 max-w-max" />

      <div className="flex items-center gap-x-8">
        {isMobile ? (
          <MobileMenu logout={logout} />
        ) : (
          <>
            <Link to="/home">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/create-post">Create Post</Link>
            <Link to="/my-following-posts">Following Posts</Link>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button>Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row items-center justify-center gap-x-2">
                  <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                  <Button onClick={logout}>Yes</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}

const MobileMenu = ({ logout }: { logout: any }) => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  return (
    <div>
      <Popover open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
        <PopoverTrigger>
          <Logs className="h-7 w-7" />
        </PopoverTrigger>
        <PopoverContent className="grid p-2 mt-4 mr-1 shadow-none w-44 gap-y-2">
          <Link to="/home">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/create-post">Create Post</Link>
          <Link to="/my-following-posts">Following Posts</Link>
          <AlertDialog>
            <AlertDialogTrigger className="flex items-start">Logout</AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row items-center justify-center gap-x-2">
                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                <Button onClick={logout}>Yes</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PopoverContent>
      </Popover>
    </div>
  );
};
