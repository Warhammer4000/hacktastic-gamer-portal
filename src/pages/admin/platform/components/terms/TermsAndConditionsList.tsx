import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type TermsAndConditions = {
  id: string;
  content: string;
  version: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
};

type TermsAndConditionsListProps = {
  terms: TermsAndConditions | null;
  isLoading: boolean;
  onEdit: (terms: TermsAndConditions) => void;
};

export function TermsAndConditionsList({ terms, isLoading, onEdit }: TermsAndConditionsListProps) {
  if (isLoading) {
    return (
      <Card className="h-[60vh]">
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

  if (!terms) {
    return (
      <Card className="h-[60vh]">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No terms and conditions have been created yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[60vh]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Version {terms.version}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={terms.status === 'published' ? 'default' : 'secondary'}>
            {terms.status}
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => onEdit(terms)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          {terms.status === 'published' && terms.published_at ? (
            <span>Published on {format(new Date(terms.published_at), "PPP")}</span>
          ) : (
            <span>Created on {format(new Date(terms.created_at), "PPP")}</span>
          )}
        </div>
        <ScrollArea className="h-[calc(60vh-8rem)] w-full rounded-md border p-4">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: terms.content }} 
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}