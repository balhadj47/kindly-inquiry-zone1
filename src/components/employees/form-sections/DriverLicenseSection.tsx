
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface DriverLicenseSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DriverLicenseSection: React.FC<DriverLicenseSectionProps> = ({
  control,
  isSubmitting,
}) => {
  const licenseCategories = ['A', 'B', 'C', 'D', 'BE', 'CE', 'DE'];

  return (
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          🚗 Permis de conduire
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informations sur le permis de conduire
        </p>
      </div>

      <div className="bg-muted/20 rounded-lg p-4 border border-border/30 space-y-4">
        <FormField
          control={control}
          name="driverLicense"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Numéro de permis</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: 123456789012"
                  disabled={isSubmitting}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="driverLicenseStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Date de délivrance</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    disabled={isSubmitting}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="driverLicenseExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Date d'expiration</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    disabled={isSubmitting}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="driverLicenseCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Catégories</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {licenseCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={field.value?.includes(category)}
                      onCheckedChange={(checked) => {
                        const currentCategories = field.value || [];
                        if (checked) {
                          field.onChange([...currentCategories, category]);
                        } else {
                          field.onChange(currentCategories.filter((c: string) => c !== category));
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DriverLicenseSection;
