import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Our Platform</h1>
        <p className="text-muted-foreground">Please login to access the dashboard</p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}