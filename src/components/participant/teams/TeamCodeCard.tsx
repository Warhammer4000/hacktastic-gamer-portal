import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamCodeCardProps {
  joinCode: string;
}

export function TeamCodeCard({ joinCode }: TeamCodeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Code</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">Share this code with others to join your team:</p>
        <code className="bg-muted px-2 py-1 rounded">{joinCode}</code>
      </CardContent>
    </Card>
  );
}