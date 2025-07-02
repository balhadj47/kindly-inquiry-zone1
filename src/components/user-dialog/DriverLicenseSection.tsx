
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface DriverLicenseSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DriverLicenseSection: React.FC<DriverLicenseSectionProps> = ({
  control,
  isSubmitting,
}) => {
  const licenseCategories = ['A', 'A1', 'A2', 'B', 'BE', 'C', 'CE', 'C1', 'C1E', 'D', 'DE', 'D1', 'D1E'];

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      'A': 'Motocyclettes',
      'A1': 'Motocyclettes légères',
      'A2': 'Motocyclettes intermédiaires',
      'B': 'Voitures particulières',
      'BE': 'Voitures + remorque',
      'C': 'Poids lourds',
      'CE': 'Poids lourds + remorque',
      'C1': 'Camions moyens',
      'C1E': 'Camions moyens + remorque',
      'D': 'Autobus',
      'DE': 'Autobus + remorque',
      'D1': 'Minibus',
      'D1E': 'Minibus + remorque'
    };
    return descriptions[category] || '';
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          🚗 Permis de conduire
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informations relatives au permis de conduire
        </p>
      </div>
      
      {/* License Number */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          🆔 Numéro de permis
        </h4>
        
        <FormField
          control={control}
          name="driverLicense"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Numéro de permis</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: 123456789"
                  disabled={isSubmitting}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* License Categories */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          📋 Catégories de permis
        </h4>
        
        <FormField
          control={control}
          name="driverLicenseCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Catégories autorisées</FormLabel>
              <div className="space-y-3 mt-4">
                {licenseCategories.map((category) => (
                  <div key={category} className="border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
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
                          className="transition-all duration-200"
                        />
                        <div>
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            <Badge variant="outline" className="mr-2">
                              {category}
                            </Badge>
                            {getCategoryDescription(category)}
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {field.value?.includes(category) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6 pt-3 border-t border-border/30 bg-muted/30 rounded p-3">
                        <FormField
                          control={control}
                          name={`driverLicenseCategoryDates.${category}.start`}
                          render={({ field: startField }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium">📅 Date d'obtention</FormLabel>
                              <FormControl>
                                <Input
                                  {...startField}
                                  type="date"
                                  disabled={isSubmitting}
                                  className="h-8 text-xs transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={control}
                          name={`driverLicenseCategoryDates.${category}.expiry`}
                          render={({ field: expiryField }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium">⏰ Date d'expiration</FormLabel>
                              <FormControl>
                                <Input
                                  {...expiryField}
                                  type="date"
                                  disabled={isSubmitting}
                                  className="h-8 text-xs transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
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
