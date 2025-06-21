
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { useToast } from '@/hooks/use-toast';

export const useSystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: settings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['system-settings'],
    queryFn: SystemSettingsService.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getSetting = (key: string, defaultValue: string = '') => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || defaultValue;
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await SystemSettingsService.updateSetting(key, value);
      await queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Paramètre mis à jour",
        description: "Le paramètre a été sauvegardé avec succès.",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le paramètre.",
        variant: "destructive",
      });
    }
  };

  const updateSettings = async (settingsToUpdate: Record<string, string>) => {
    try {
      await SystemSettingsService.updateSettings(settingsToUpdate);
      await queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: "Tous les paramètres ont été sauvegardés avec succès.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    isLoading,
    error,
    getSetting,
    updateSetting,
    updateSettings,
    refetch
  };
};
