import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
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
import { Blocks, Home, LogOut, Logs, PictureInPicture, User } from "lucide-react";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/login");
  }
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center justify-center w-full mt-1">
      {/* <Link to="/home">
        <img src={VibezLogo} alt="logo" className="h-8 cursor-pointer max-w-max" />
      </Link> */}
      <div className="flex items-center gap-x-14">
        {isMobile ? (
          <MobileMenu logout={logout} />
        ) : (
          <>
            <NavMenuItem to="/home" text="Home" />
            <NavMenuItem to="/profile" text="Profile" />
            <NavMenuItem to="/create-post" text="Create Post" />
            <NavMenuItem to="/my-following-posts" text="Following Posts" />
            <div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <p className="text-white hover:text-gray-600">Logout</p>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const MobileMenu = ({ logout }: { logout: () => void }) => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  return (
    <div>
      <Popover open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
        <PopoverTrigger>
          <Logs className="text-white h-7 w-7 hover:text-gray-600" />
        </PopoverTrigger>
        <PopoverContent className="grid p-2 px-0 py-0 mt-4 mr-1 text-teal-700 bg-white shadow-none w-44">
          <MobileMenuItem to="/home" icon={<Home className="w-4 h-4" />} text="Home" />
          <MobileMenuItem to="/profile" icon={<User className="w-4 h-4" />} text="Profile" />
          <MobileMenuItem to="/create-post" icon={<PictureInPicture className="w-4 h-4" />} text="Create Post" />
          <MobileMenuItem to="/my-following-posts" icon={<Blocks className="w-4 h-4" />} text="Following Posts" />
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center p-2 px-3 hover:text-blue-800 gap-x-2 hover:bg-gray-100">
              <LogOut className="w-4 h-4 text-white" /> Logout
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

const MobileMenuItem = ({ to, icon, text }: { to: string; icon: ReactNode; text: string }) => {
  return (
    <Link
      to={to}
      className="flex items-center p-3 border-b border-b-blue-50 hover:text-teal-600 gap-x-2 hover:bg-teal-50"
    >
      {icon}
      {text}
    </Link>
  );
};

const NavMenuItem = ({ to, text }: { to: string; text: string }) => {
  return (
    <Link to={to} className="text-white hover:text-gray-600">
      {text}
    </Link>
  );
};
