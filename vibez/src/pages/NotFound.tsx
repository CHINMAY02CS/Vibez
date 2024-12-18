import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Page Not Found</h1>
      <h3>Please go back</h3>
      <Button onClick={() => navigate("/dashboard")}>Back</Button>
    </div>
  );
}
