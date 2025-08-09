
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface IdentityDocumentsSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const IdentityDocumentsSection: React.FC<IdentityDocumentsSectionProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          🆔 Documents d'identité
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informations relatives aux documents officiels
        </p>
      </div>
      
      {/* National Identification */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          📄 Identification nationale
        </h4>
        
        <FormField
          control={control}
          name="identificationNational"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Numéro d'identification nationale</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ex: 1234567890123"
                  disabled={isSubmitting}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* National Card */}
      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          🪪 Carte nationale d'identité
        </h4>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="carteNational"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Numéro de carte nationale</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: AB123456"
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
              name="carteNationalStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">📅 Date de délivrance</FormLabel>
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
              name="carteNationalExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">⏰ Date d'expiration</FormLabel>
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
        </div>
      </div>
    </div>
  );
};

export default IdentityDocumentsSection;
