
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Shield, Palette } from 'lucide-react';

const UserSettings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  // Profile settings state
  const [profileData, setProfileData] = useState({
    displayName: user?.email?.split('@')[0] || '',
    bio: '',
    timezone: 'Europe/Paris',
    phoneNumber: '',
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    tripReminders: true,
    weeklyReports: false,
    systemUpdates: true,
  });

  // Appearance settings state
  const [appearance, setAppearance] = useState({
    theme: 'system',
    compactMode: false,
    showTutorials: true,
  });

  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été sauvegardées avec succès.",
    });
  };

  const handleSaveNotifications = () => {
    // Here you would typically save to your backend
    toast({
      title: "Préférences de notification mises à jour",
      description: "Vos paramètres de notification ont été sauvegardés.",
    });
  };

  const handleSaveAppearance = () => {
    // Here you would typically save to your backend
    toast({
      title: "Paramètres d'apparence mis à jour",
      description: "Vos préférences d'affichage ont été sauvegardées.",
    });
  };

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
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Informations du Profil</CardTitle>
            </div>
            <CardDescription>
              Gérez vos informations personnelles et vos préférences de profil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  L'adresse email ne peut pas être modifiée.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Nom d'Affichage</Label>
                <Input 
                  id="displayName" 
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  placeholder="Votre nom d'affichage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Numéro de Téléphone</Label>
                <Input 
                  id="phoneNumber" 
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau Horaire</Label>
                <Select value={profileData.timezone} onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea 
                id="bio" 
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Parlez-nous de vous..."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>
                Sauvegarder le Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configurez la façon dont vous recevez les notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Notifications par Email</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications importantes par email
                  </p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Notifications Push</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications instantanées dans le navigateur
                  </p>
                </div>
                <Switch 
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rappels de Voyage</p>
                  <p className="text-sm text-muted-foreground">
                    Rappels automatiques pour vos voyages programmés
                  </p>
                </div>
                <Switch 
                  checked={notifications.tripReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, tripReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rapports Hebdomadaires</p>
                  <p className="text-sm text-muted-foreground">
                    Résumé hebdomadaire de votre activité
                  </p>
                </div>
                <Switch 
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mises à Jour Système</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications sur les nouvelles fonctionnalités et mises à jour
                  </p>
                </div>
                <Switch 
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications}>
                Sauvegarder les Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Langue et Région</CardTitle>
            <CardDescription>
              Configuration de la langue de l'interface.
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
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Français
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Apparence</CardTitle>
            </div>
            <CardDescription>
              Personnalisez l'apparence de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select value={appearance.theme} onValueChange={(value) => setAppearance({ ...appearance, theme: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mode Compact</p>
                  <p className="text-sm text-muted-foreground">
                    Interface plus dense avec moins d'espacement
                  </p>
                </div>
                <Switch 
                  checked={appearance.compactMode}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Afficher les Tutoriels</p>
                  <p className="text-sm text-muted-foreground">
                    Aide contextuelle et conseils d'utilisation
                  </p>
                </div>
                <Switch 
                  checked={appearance.showTutorials}
                  onCheckedChange={(checked) => setAppearance({ ...appearance, showTutorials: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveAppearance}>
                Sauvegarder l'Apparence
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Sécurité</CardTitle>
            </div>
            <CardDescription>
              Gérez la sécurité de votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Changer le Mot de Passe</p>
                  <p className="text-sm text-muted-foreground">
                    Modifier votre mot de passe de connexion
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sessions Actives</p>
                  <p className="text-sm text-muted-foreground">
                    Gérer les appareils connectés à votre compte
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Gérer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
