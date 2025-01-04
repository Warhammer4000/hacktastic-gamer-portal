import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function RegistrationClosed() {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-md mx-auto mt-20 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Registration Closed</h1>
      <p className="text-muted-foreground mb-6">
        Mentor registration is currently not available. Please check back later.
      </p>
      <Button onClick={() => navigate("/")}>Back to Home</Button>
    </div>
  );
}