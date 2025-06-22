
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, UserStatus } from '@/types/rbac';

const employeeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  badgeNumber: z.string().min(1, 'Le numéro de badge est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  address: z.string().optional(),
  driverLicense: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Récupération', 'Congé', 'Congé maladie']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeModalFormProps {
  employee: User | null;
  onSubmit: (data: Partial<User>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const EmployeeModalForm: React.FC<EmployeeModalFormProps> = ({
  employee,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || '',
      badgeNumber: employee?.badgeNumber || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      dateOfBirth: employee?.dateOfBirth || '',
      placeOfBirth: employee?.placeOfBirth || '',
      address: employee?.address || '',
      driverLicense: employee?.driverLicense || '',
      status: employee?.status || 'Active',
    },
  });

  const statusValue = watch('status');

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit({
      ...data,
      email: data.email || undefined,
      phone: data.phone || undefined,
      role_id: 3, // Always set to 3 for employees
      group_id: 3, // Always set to 3 for employees
    });
  };

  const statuses: UserStatus[] = ['Active', 'Inactive', 'Suspended', 'Récupération', 'Congé', 'Congé maladie'];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Nom et prénom"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="badgeNumber">Numéro de badge *</Label>
          <Input
            id="badgeNumber"
            {...register('badgeNumber')}
            placeholder="Ex: EMP001"
          />
          {errors.badgeNumber && <p className="text-sm text-red-600">{errors.badgeNumber.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+33 6 12 34 56 78"
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="exemple@email.com"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de naissance</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
          <Input
            id="placeOfBirth"
            {...register('placeOfBirth')}
            placeholder="Ville, Pays"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverLicense">Permis de conduire</Label>
          <Input
            id="driverLicense"
            {...register('driverLicense')}
            placeholder="Numéro de permis"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={statusValue} onValueChange={(value) => setValue('status', value as UserStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Adresse complète"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : (employee ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeModalForm;
