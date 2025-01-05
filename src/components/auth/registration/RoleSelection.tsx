import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Lightbulb } from "lucide-react";

interface RoleSelectionProps {
  selectedRole: "participant" | "mentor";
  onRoleSelect: (role: "participant" | "mentor") => void;
}

export default function RoleSelection({ selectedRole, onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card 
        className={`cursor-pointer hover:border-primary transition-colors ${
          selectedRole === "participant" ? "border-primary" : ""
        }`}
        onClick={() => onRoleSelect("participant")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Participant
          </CardTitle>
          <CardDescription>
            Join as a participant to learn and grow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Access to learning materials</li>
            <li>Participate in workshops</li>
            <li>Connect with mentors</li>
            <li>Track your progress</li>
          </ul>
        </CardContent>
      </Card>

      <Card 
        className={`cursor-pointer hover:border-primary transition-colors ${
          selectedRole === "mentor" ? "border-primary" : ""
        }`}
        onClick={() => onRoleSelect("mentor")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Mentor
          </CardTitle>
          <CardDescription>
            Share your knowledge and guide others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Guide participants</li>
            <li>Share your expertise</li>
            <li>Create learning content</li>
            <li>Build your network</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}