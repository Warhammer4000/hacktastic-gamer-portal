import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { useEmailProviderActions } from "../useEmailProviderActions";
import { EmailProvider } from "../types";

interface ProviderGuideProps {
  provider: EmailProvider;
}

export function ProviderGuide({ provider }: ProviderGuideProps) {
  const { getProviderGuide } = useEmailProviderActions();
  const guide = getProviderGuide(provider.type);

  if (!guide.description) return null;

  return (
    <Alert>
      <AlertDescription className="flex items-center gap-2">
        {guide.description}
        {guide.url && (
          <a 
            href={guide.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline"
          >
            Get API Key
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        )}
      </AlertDescription>
    </Alert>
  );
}