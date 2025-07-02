
import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoSectionProps {
  control: Control<any>;
  isSubmitting: boolean;
  isEmailRequired?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  isSubmitting,
  isEmailRequired = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/50 pb-3">
        <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
          Informations de base
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Renseignez les informations principales de l'utilisateur
        </p>
      </div>
      
      {/* Personal Information Group */}
      <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
        <h4 className="text-xs sm:text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          📋 Informations personnelles
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={control}
            name="name"
            rules={{ required: 'Le nom est requis' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm font-medium flex items-center gap-1">
                  Nom complet 
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: Jean Dupont"
                    disabled={isSubmitting}
                    className="text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              control={control}
              name="email"
              rules={isEmailRequired ? { 
                required: 'L\'email est requis',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Format d\'email invalide'
                }
              } : {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Format d\'email invalide'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium flex items-center gap-1">
                    📧 Email 
                    {isEmailRequired && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="ex: jean.dupont@exemple.com"
                      disabled={isSubmitting}
                      className="text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium flex items-center gap-1">
                    📞 Téléphone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: +33 1 23 45 67 89"
                      disabled={isSubmitting}
                      className="text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Status Group */}
      <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
        <h4 className="text-xs sm:text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          ⚡ Statut
        </h4>
        
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm font-medium">Statut de l'utilisateur</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger 
                    disabled={isSubmitting}
                    className="text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  >
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Actif
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Inactif
                    </div>
                  </SelectItem>
                  <SelectItem value="Suspended">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Suspendu
                    </div>
                  </SelectItem>
                  <SelectItem value="Récupération">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Récupération
                    </div>
                  </SelectItem>
                  <SelectItem value="Congé">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Congé
                    </div>
                  </SelectItem>
                  <SelectItem value="Congé maladie">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Congé maladie
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
