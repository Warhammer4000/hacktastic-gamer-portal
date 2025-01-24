import { Button } from "@/components/ui/button";
import { EmailProvider } from "../types";

interface ProviderActionsProps {
  provider: EmailProvider;
  onTestConnection: (provider: EmailProvider) => Promise<void>;
  onSaveConfiguration: (provider: EmailProvider) => Promise<void>;
  hasValidSettings: boolean;
  canSave: boolean;
}

export function ProviderActions({ 
  provider, 
  onTestConnection, 
  onSaveConfiguration,
  hasValidSettings,
  canSave 
}: ProviderActionsProps) {
  return (
    <div className="flex gap-4 mt-4">
      <Button 
        variant="secondary" 
        onClick={() => onTestConnection(provider)}
        disabled={!hasValidSettings}
      >
        Test Connection
      </Button>
      
      <Button
        onClick={() => onSaveConfiguration(provider)}
        disabled={!canSave}
      >
        Save Configuration
      </Button>
    </div>
  );
}