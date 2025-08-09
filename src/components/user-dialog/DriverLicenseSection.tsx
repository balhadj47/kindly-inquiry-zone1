
import React, { useState } from 'react';
import { Control, useWatch, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface DriverLicenseSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const DriverLicenseSection: React.FC<DriverLicenseSectionProps> = ({
  control,
  isSubmitting,
}) => {
  // Safely access form context with error handling
  let setValue: any = null;
  try {
    const formContext = useFormContext();
    setValue = formContext?.setValue;
  } catch (error) {
    console.error('🔴 Form context not available in DriverLicenseSection:', error);
  }

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');

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

  // Watch the current form values
  const currentCategories = useWatch({
    control,
    name: 'driverLicenseCategory',
    defaultValue: []
  });

  const currentCategoryDates = useWatch({
    control,
    name: 'driverLicenseCategoryDates',
    defaultValue: {}
  });

  // Get available categories (not already added)
  const availableCategories = licenseCategories.filter(
    category => !currentCategories?.includes(category)
  );

  const addCategory = () => {
    if (!selectedCategory || !startDate || !setValue) {
      console.warn('🔴 Cannot add category: missing data or setValue function');
      return;
    }

    try {
      // Add to categories array
      const updatedCategories = [...(currentCategories || []), selectedCategory];
      
      // Add to dates object
      const updatedDates = {
        ...currentCategoryDates,
        [selectedCategory]: {
          start: startDate,
          expiry: expiryDate
        }
      };

      // Update form values using setValue from useFormContext
      setValue('driverLicenseCategory', updatedCategories);
      setValue('driverLicenseCategoryDates', updatedDates);

      // Reset form
      setSelectedCategory('');
      setStartDate('');
      setExpiryDate('');
      
      console.log('✅ Category added successfully:', selectedCategory);
    } catch (error) {
      console.error('🔴 Error adding category:', error);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (!setValue) {
      console.warn('🔴 Cannot remove category: setValue function not available');
      return;
    }

    try {
      // Remove from categories array
      const updatedCategories = currentCategories?.filter(cat => cat !== categoryToRemove) || [];
      
      // Remove from dates object
      const updatedDates = { ...currentCategoryDates };
      delete updatedDates[categoryToRemove];

      // Update form values using setValue from useFormContext
      setValue('driverLicenseCategory', updatedCategories);
      setValue('driverLicenseCategoryDates', updatedDates);
      
      console.log('✅ Category removed successfully:', categoryToRemove);
    } catch (error) {
      console.error('🔴 Error removing category:', error);
    }
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
        
        {/* Add Category Form */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/30 mb-4">
          <h5 className="text-sm font-medium mb-3">Ajouter une catégorie</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            {/* Category Selection */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Catégorie
              </label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                disabled={isSubmitting || availableCategories.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border shadow-lg z-50">
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {category}
                        </Badge>
                        <span className="text-sm">{getCategoryDescription(category)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                📅 Date d'obtention
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSubmitting}
                className="h-9 text-xs"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                ⏰ Date d'expiration
              </label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                disabled={isSubmitting}
                className="h-9 text-xs"
              />
            </div>

            {/* Add Button */}
            <Button
              type="button"
              onClick={addCategory}
              disabled={!selectedCategory || !startDate || isSubmitting || !setValue}
              size="sm"
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {!setValue && (
            <p className="text-xs text-destructive mt-2">
              ⚠️ Form context non disponible - Les modifications ne seront pas sauvegardées
            </p>
          )}
        </div>

        {/* Added Categories List */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Catégories ajoutées</h5>
          
          {(!currentCategories || currentCategories.length === 0) ? (
            <div className="text-sm text-muted-foreground p-4 text-center border border-dashed border-border/50 rounded-lg">
              Aucune catégorie ajoutée
            </div>
          ) : (
            <div className="space-y-2">
              {currentCategories.map((category) => {
                const dates = currentCategoryDates?.[category];
                return (
                  <div 
                    key={category} 
                    className="flex items-center justify-between p-3 bg-background/80 border border-border/30 rounded-lg hover:bg-background/90 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="outline" className="shrink-0">
                        {category}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {getCategoryDescription(category)}
                        </div>
                        {dates && (
                          <div className="text-xs text-muted-foreground mt-1">
                            📅 Obtention: {dates.start ? new Date(dates.start).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                            {dates.expiry && (
                              <> • ⏰ Expiration: {new Date(dates.expiry).toLocaleDateString('fr-FR')}</>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(category)}
                      disabled={isSubmitting || !setValue}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hidden form fields to maintain form state */}
        <FormField
          control={control}
          name="driverLicenseCategory"
          render={() => <FormItem className="hidden"><FormMessage /></FormItem>}
        />
        
        <FormField
          control={control}
          name="driverLicenseCategoryDates"
          render={() => <FormItem className="hidden"><FormMessage /></FormItem>}
        />
      </div>
    </div>
  );
};

export default DriverLicenseSection;
