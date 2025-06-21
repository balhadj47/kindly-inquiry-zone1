
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Skeleton } from '@/components/ui/skeleton';

const SystemSettingsPage = () => {
  const { settings, getSetting, updateSettings, isLoading } = useSystemSettings();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (settings.length > 0) {
      const data: Record<string, string> = {};
      settings.forEach(setting => {
        data[setting.setting_key] = setting.setting_value;
      });
      setFormData(data);
    }
  }, [settings]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Paramètres Système</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres globaux de l'application
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branding & Identité</CardTitle>
          <CardDescription>
            Configurez le nom, slogan et couleurs de votre application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="app_name">Nom de l'application</Label>
              <Input
                id="app_name"
                value={formData.app_name || ''}
                onChange={(e) => handleInputChange('app_name', e.target.value)}
                placeholder="SSB"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app_slogan">Slogan</Label>
              <Input
                id="app_slogan"
                value={formData.app_slogan || ''}
                onChange={(e) => handleInputChange('app_slogan', e.target.value)}
                placeholder="Fonds & Escorte"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_color">Couleur principale</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color || '#3b82f6'}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.primary_color || '#3b82f6'}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Couleur secondaire</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData.secondary_color || '#1e40af'}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.secondary_color || '#1e40af'}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  placeholder="#1e40af"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pied de page</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="footer_text">Texte du pied de page</Label>
                <Input
                  id="footer_text"
                  value={formData.footer_text || ''}
                  onChange={(e) => handleInputChange('footer_text', e.target.value)}
                  placeholder="© 2025 asdar it"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_link">Lien du pied de page</Label>
                <Input
                  id="footer_link"
                  type="url"
                  value={formData.footer_link || ''}
                  onChange={(e) => handleInputChange('footer_link', e.target.value)}
                  placeholder="https://asdar.net"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full md:w-auto"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;
