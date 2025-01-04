import { format } from "date-fns";
import { Edit2 } from "lucide-react";
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
  policy: PrivacyPolicy | null;
  isLoading: boolean;
  onEdit: (policy: PrivacyPolicy) => void;
};

export function PrivacyPolicyList({ policy, isLoading, onEdit }: PrivacyPolicyListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="animate-pulse h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="animate-pulse h-6 bg-gray-200 rounded w-24"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!policy) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No privacy policy has been created yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
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
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.content }} 
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}