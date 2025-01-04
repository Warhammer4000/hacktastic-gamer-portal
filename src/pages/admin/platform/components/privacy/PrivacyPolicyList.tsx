import { format } from "date-fns";
import { Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type PrivacyPolicy = {
  id: string;
  content: string;
  version: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
};

type PrivacyPolicyListProps = {
  policies: PrivacyPolicy[];
  isLoading: boolean;
  onEdit: (policy: PrivacyPolicy) => void;
};

export function PrivacyPolicyList({ policies, isLoading, onEdit }: PrivacyPolicyListProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <Card key={policy.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Version {policy.version}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={policy.status === 'published' ? 'default' : 'secondary'}>
                {policy.status}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => onEdit(policy)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {policy.status === 'published' && policy.published_at ? (
                <span>Published on {format(new Date(policy.published_at), "PPP")}</span>
              ) : (
                <span>Created on {format(new Date(policy.created_at), "PPP")}</span>
              )}
            </div>
            <ScrollArea className="h-[100px] w-full rounded-md border p-4">
              <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: policy.content }} />
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}