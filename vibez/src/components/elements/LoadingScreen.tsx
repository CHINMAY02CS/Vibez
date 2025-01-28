import { Loader } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen m-auto">
      <Loader className="w-12 h-12 animate-spin" />
    </div>
  );
}
