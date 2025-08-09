
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');

  // Get form context for setValue access
  const formContext = useFormContext();
  const setValue = formContext?.setValue;

  const licenseCategories = [
    { value: 'A', label: 'A - Motocyclettes' },
    { value: 'A1', label: 'A1 - Motocyclettes légères' },
    { value: 'A2', label: 'A2 - Motocyclettes intermédiaires' },
    { value: 'B', label: 'B - Voitures particulières' },
    { value: 'BE', label: 'BE - Voitures + remorque' },
    { value: 'C', label: 'C - Poids lourds' },
    { value: 'CE', label: 'CE - Poids lourds + remorque' },
    { value: 'C1', label: 'C1 - Camions moyens' },
    { value: 'C1E', label: 'C1E - Camions moyens + remorque' },
    { value: 'D', label: 'D - Autobus' },
    { value: 'DE', label: 'DE - Autobus + remorque' },
    { value: 'D1', label: 'D1 - Minibus' },
    { value: 'D1E', label: 'D1E - Minibus + remorque' }
  ];

  // Watch the current form values
  const currentCategories = useWatch({
    control,
    name: 'driverLicenseCategory',
    defaultValue: []
  }) || [];

  const currentCategoryDates = useWatch({
    control,
    name: 'driverLicenseCategoryDates',
    defaultValue: {}
  }) || {};

  // Get available categories (not already added)
  const availableCategories = licenseCategories.filter(
    category => !currentCategories.includes(category.value)
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // If we have both category and start date, add it immediately
    if (category && startDate) {
      handleAddCategory(category, startDate, expiryDate);
    }
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    
    // If we have both category and start date, add it immediately
    if (selectedCategory && date) {
      handleAddCategory(selectedCategory, date, expiryDate);
    }
  };

  const handleExpiryDateChange = (date: string) => {
    setExpiryDate(date);
    
    // If we have category and start date, update the existing entry or add new one
    if (selectedCategory && startDate) {
      handleAddCategory(selectedCategory, startDate, date);
    }
  };

  const handleAddCategory = (category?: string, start?: string, expiry?: string) => {
    const categoryToAdd = category || selectedCategory;
    const startToAdd = start || startDate;
    const expiryToAdd = expiry || expiryDate;

    if (!categoryToAdd || !startToAdd || !setValue) {
      console.warn('🔴 Cannot add category: missing data or setValue function');
      return;
    }

    try {
      // Create clean copies to avoid circular references
      const updatedCategories = currentCategories.includes(categoryToAdd) 
        ? currentCategories 
        : [...currentCategories, categoryToAdd];
      
      const updatedDates = {
        ...currentCategoryDates,
        [categoryToAdd]: {
          start: startToAdd,
          expiry: expiryToAdd || undefined
        }
      };

      console.log('🔍 DriverLicenseSection - Adding/updating category:', categoryToAdd);
      console.log('🔍 DriverLicenseSection - Updated categories:', updatedCategories);
      console.log('🔍 DriverLicenseSection - Updated dates:', updatedDates);

      // Update form values
      setValue('driverLicenseCategory', updatedCategories);
      setValue('driverLicenseCategoryDates', updatedDates);

      // Reset form only if this was a new addition
      if (!currentCategories.includes(categoryToAdd)) {
        setSelectedCategory('');
        setStartDate('');
        setExpiryDate('');
      }
      
      console.log('✅ DriverLicenseSection - Category processed successfully:', categoryToAdd);
    } catch (error) {
      console.error('🔴 DriverLicenseSection - Error processing category:', error);
    }
  };

  const handleRemoveCategory = (category: string) => {
    if (!setValue) {
      console.warn('🔴 Cannot remove category: missing setValue function');
      return;
    }

    try {
      // Create clean copies to avoid circular references
      const updatedCategories = currentCategories.filter((cat: string) => cat !== category);
      
      const updatedDates = { ...currentCategoryDates };
      delete updatedDates[category];

      console.log('🔍 DriverLicenseSection - Removing category:', category);
      console.log('🔍 DriverLicenseSection - Updated categories:', updatedCategories);
      console.log('🔍 DriverLicenseSection - Updated dates:', updatedDates);

      // Update form values
      setValue('driverLicenseCategory', updatedCategories);
      setValue('driverLicenseCategoryDates', updatedDates);
      
      console.log('✅ DriverLicenseSection - Category removed successfully:', category);
    } catch (error) {
      console.error('🔴 DriverLicenseSection - Error removing category:', error);
    }
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = licenseCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Category Selection */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Catégorie
              </label>
              <Select 
                value={selectedCategory} 
                onValueChange={handleCategorySelect}
                disabled={isSubmitting || availableCategories.length === 0}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner une catégorie..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border shadow-lg z-50">
                  {availableCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {category.value}
                        </Badge>
                        <span className="text-sm">{category.label.split(' - ')[1]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                📅 Date d'obtention *
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                disabled={isSubmitting || !selectedCategory}
                className="h-9 text-xs"
                placeholder="Date d'obtention requise"
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
                onChange={(e) => handleExpiryDateChange(e.target.value)}
                disabled={isSubmitting || !selectedCategory}
                className="h-9 text-xs"
                placeholder="Optionnelle"
              />
            </div>
          </div>

          {availableCategories.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Toutes les catégories disponibles ont été ajoutées
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
              {currentCategories.map((category: string) => {
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
                          {getCategoryLabel(category)}
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
                    
                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(category)}
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
