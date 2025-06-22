
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRoleDisplayNameById } from '@/utils/rolePermissions';

interface SystemFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const SystemFields: React.FC<SystemFieldsProps> = ({
  control,
  isSubmitting,
}) => {
  // Only show Administrator and Supervisor roles (exclude Employee role_id: 3)
  const availableRoles = [
    { id: 1, name: getRoleDisplayNameById(1) }, // Administrator
    { id: 2, name: getRoleDisplayNameById(2) }, // Supervisor
  ];

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
