import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function TeamListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-muted/50">
          <CardHeader>
            <div className="h-6 w-1/3 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-1/4 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}