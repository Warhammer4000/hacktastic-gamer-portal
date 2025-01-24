import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { EmailProvider } from "./types";
import { ProviderHeader } from "./components/ProviderHeader";
import { ProviderGuide } from "./components/ProviderGuide";
import { ProviderSettings } from "./components/ProviderSettings";
import { ProviderActions } from "./components/ProviderActions";

interface EmailProviderCardProps {
  provider: EmailProvider;
  onStatusChange: (providerId: string, isActive: boolean) => void;
  onSettingChange: (settingId: string, value: string) => void;
  onTestConnection: (provider: EmailProvider) => Promise<void>;
  onSaveConfiguration: (provider: EmailProvider) => Promise<void>;
  testedProviders: Set<string>;
}

export function EmailProviderCard({
  provider,
  onStatusChange,
  onSettingChange,
  onTestConnection,
  onSaveConfiguration,
  testedProviders,
}: EmailProviderCardProps) {
  const hasValidSettings = provider.settings?.every(s => s.value);
  const canSave = testedProviders.has(provider.id);

  return (
    <Card>
      <ProviderHeader 
        provider={provider} 
        onStatusChange={onStatusChange} 
      />
      <CardContent className={cn("space-y-4", !provider.is_active && "hidden")}>
        <ProviderGuide provider={provider} />
        <ProviderSettings 
          provider={provider}
          onSettingChange={onSettingChange}
        />
        <ProviderActions 
          provider={provider}
          onTestConnection={onTestConnection}
          onSaveConfiguration={onSaveConfiguration}
          hasValidSettings={hasValidSettings}
          canSave={canSave}
        />
      </CardContent>
    </Card>
  );
}