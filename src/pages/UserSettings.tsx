
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const UserSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.settings}</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte et vos préférences.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Langue et Région</CardTitle>
            <CardDescription>
              Choisissez votre langue préférée pour l'interface de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Langue de l'Interface</p>
                <p className="text-sm text-muted-foreground">
                  Cette application est configurée en français uniquement.
                </p>
              </div>
              <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
                Français
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Gérez les informations de votre profil et vos préférences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Les paramètres de profil seront disponibles dans les futures mises à jour.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configurez la façon dont vous recevez les notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Les paramètres de notification seront disponibles dans les futures mises à jour.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
