import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, Lightbulb } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto mt-20 p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Join Our Community</h1>
        <p className="text-muted-foreground mt-2">
          Choose how you want to participate
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => navigate("/participant/register")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-6 w-6" />
              Participant
            </CardTitle>
            <CardDescription>
              Join as a participant to learn and grow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Access to learning materials</li>
              <li>Participate in workshops</li>
              <li>Connect with mentors</li>
              <li>Track your progress</li>
            </ul>
            <Button className="w-full mt-4">Register as Participant</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate("/mentor/register")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Mentor
            </CardTitle>
            <CardDescription>
              Share your knowledge and guide others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Guide participants</li>
              <li>Share your expertise</li>
              <li>Create learning content</li>
              <li>Build your network</li>
            </ul>
            <Button className="w-full mt-4">Register as Mentor</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}