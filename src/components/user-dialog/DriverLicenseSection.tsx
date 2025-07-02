
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
  const licenseCategories = ['A', 'A1', 'A2', 'B', 'BE', 'C', 'CE', 'C1', 'C1E', 'D', 'DE', 'D1', 'D1E'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Permis de conduire</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="driverLicense"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Numéro de permis</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: 123456789"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="driverLicenseStartDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'obtention</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  disabled={isSubmitting}
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
              <FormLabel>Date d'expiration</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  disabled={isSubmitting}
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
            <FormLabel>Catégories de permis</FormLabel>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
              {licenseCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={field.value?.includes(category) || false}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, category]);
                      } else {
                        field.onChange(currentValue.filter((c: string) => c !== category));
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
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
  );
};

export default DriverLicenseSection;
