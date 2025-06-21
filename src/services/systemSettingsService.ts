
import { supabase, requireAuth } from '@/integrations/supabase/client';

export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export class SystemSettingsService {
  static async getSettings(): Promise<SystemSetting[]> {
    await requireAuth();
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key');
    
    if (error) throw error;
    return data || [];
  }

  static async getSetting(key: string): Promise<string | null> {
    await requireAuth();
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single();
    
    if (error) return null;
    return data?.setting_value || null;
  }

  static async updateSetting(key: string, value: string): Promise<void> {
    await requireAuth();
    const { error } = await supabase
      .from('system_settings')
      .update({ 
        setting_value: value,
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', key);
    
    if (error) throw error;
  }

  static async updateSettings(settings: Record<string, string>): Promise<void> {
    await requireAuth();
    
    const updates = Object.entries(settings).map(([key, value]) => ({
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString()
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('system_settings')
        .update({
          setting_value: update.setting_value,
          updated_at: update.updated_at
        })
        .eq('setting_key', update.setting_key);
      
      if (error) throw error;
    }
  }
}
