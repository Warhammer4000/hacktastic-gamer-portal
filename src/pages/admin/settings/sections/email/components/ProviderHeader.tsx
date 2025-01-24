import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useEmailProviderActions } from "../useEmailProviderActions";
import { EmailProvider } from "../types";

interface ProviderHeaderProps {
  provider: EmailProvider;
  onStatusChange: (providerId: string, isActive: boolean) => void;
}

export function ProviderHeader({ provider, onStatusChange }: ProviderHeaderProps) {
  const { getProviderIcon } = useEmailProviderActions();
  const Icon = getProviderIcon(provider.type);

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>{provider.name}</CardTitle>
            <CardDescription>
              {provider.is_default ? 'Default Provider' : 'Additional Provider'}
            </CardDescription>
          </div>
        </div>
        <Switch
          checked={provider.is_active}
          onCheckedChange={(checked) => onStatusChange(provider.id, checked)}
        />
      </div>
    </CardHeader>
  );
}