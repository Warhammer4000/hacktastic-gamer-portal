import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Mail, Send, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailProvider, EmailProviderSetting } from "./types";
import { useEmailProviderActions } from "./useEmailProviderActions";

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
  const { getProviderIcon, getProviderGuide } = useEmailProviderActions();
  const Icon = getProviderIcon(provider.type);
  const guide = getProviderGuide(provider.type);
  const hasValidSettings = provider.settings?.every(s => s.value);
  const canSave = testedProviders.has(provider.id);

  return (
    <Card>
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
      <CardContent className={cn("space-y-4", !provider.is_active && "hidden")}>
        {guide.description && (
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
        )}
        
        {provider.settings?.map((setting) => (
          <div key={setting.id} className="grid gap-2">
            <Label htmlFor={setting.id}>{setting.key}</Label>
            <Input
              id={setting.id}
              type={setting.is_secret ? "password" : "text"}
              value={setting.value || ''}
              onChange={(e) => onSettingChange(setting.id, e.target.value)}
              placeholder={`Enter ${setting.key}`}
            />
          </div>
        ))}
        
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
      </CardContent>
    </Card>
  );
}