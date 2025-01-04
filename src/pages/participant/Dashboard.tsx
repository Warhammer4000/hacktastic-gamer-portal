import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParticipantDashboard() {
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Check your team status and upcoming sessions in the navigation menu.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}