
import React, { useState, useEffect } from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllRoles } from '@/utils/roleUtils';

interface SystemFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  watchedRoleId: number;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
  userId?: string;
}

const SystemFields: React.FC<SystemFieldsProps> = ({
  control,
  isSubmitting,
  watchedRoleId,
  watchedEmail,
  onEmailValidationChange,
  userId,
}) => {
  const [availableRoles, setAvailableRoles] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get roles from database directly (no cache)
    const loadRoles = async () => {
      try {
        const roles = await getAllRoles();
        // Only show Administrator and Supervisor roles (exclude Employee role_id: 3)
        const filteredRoles = roles
          .filter(role => role.id !== 3) // Exclude Employee
          .map(role => ({ id: role.id, name: role.name }));
        
        setAvailableRoles(filteredRoles);
      } catch (error) {
        console.error('Error loading roles:', error);
        setAvailableRoles([]);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  if (loading) {
    return <div>Loading roles...</div>;
  }

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="role_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rôle *</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(parseInt(value))} 
              value={field.value?.toString() || '2'} // Default to Supervisor (2)
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || 'Active'}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Active">Actif</SelectItem>
                <SelectItem value="Inactive">Inactif</SelectItem>
                <SelectItem value="Suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SystemFields;
