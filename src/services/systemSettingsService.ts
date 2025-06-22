
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

// Simple in-memory settings for now until system_settings table is created
const DEFAULT_SETTINGS: Record<string, string> = {
  'app_name': 'SSB',
  'app_slogan': 'Fonds & Escorte',
  'footer_text': '© 2025 asdar it',
  'footer_link': 'https://asdar.net'
};

export class SystemSettingsService {
  static async getSettings(): Promise<SystemSetting[]> {
    await requireAuth();
    
    // Return default settings as SystemSetting objects
    return Object.entries(DEFAULT_SETTINGS).map(([key, value], index) => ({
      id: index + 1,
      setting_key: key,
      setting_value: value,
      setting_type: 'string',
      description: `Default ${key}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  }

  static async getSetting(key: string): Promise<string | null> {
    await requireAuth();
    return DEFAULT_SETTINGS[key] || null;
  }

  static async updateSetting(key: string, value: string): Promise<void> {
    await requireAuth();
    // For now, just update the in-memory settings
    DEFAULT_SETTINGS[key] = value;
  }

  static async updateSettings(settings: Record<string, string>): Promise<void> {
    await requireAuth();
    // For now, just update the in-memory settings
    Object.assign(DEFAULT_SETTINGS, settings);
  }
}
