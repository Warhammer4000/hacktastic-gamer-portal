import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParticipantDashboard() {
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Track your learning journey</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View your scheduled sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Check your recent communications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}