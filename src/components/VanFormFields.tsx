
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, AlertTriangle, MapPin, User, Gauge, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { VanFormData } from '@/hooks/useVanForm';
import { useUsers } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';

interface VanFormFieldsProps {
  formData: VanFormData;
  onInputChange: (field: keyof VanFormData, value: any) => void;
  onDateChange: (field: keyof VanFormData, date: Date | undefined) => void;
}

const VanFormFields = ({ formData, onInputChange, onDateChange }: VanFormFieldsProps) => {
  const { t } = useLanguage();
  const { users, loading: usersLoading } = useUsers();
  const [responsibleOpen, setResponsibleOpen] = React.useState(false);

  // Check if dates are expired
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isInsuranceExpired = formData.insuranceDate && formData.insuranceDate < today;
  const isControlExpired = formData.controlDate && formData.controlDate < today;

  // Find selected responsible user
  const selectedResponsible = users.find(user => user.id === formData.currentResponsibleId);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Reference Code */}
      <div className="space-y-2">
        <Label htmlFor="reference-code" className="text-sm sm:text-base font-medium">Code de référence</Label>
        <Input
          id="reference-code"
          value={formData.referenceCode}
          onChange={(e) => onInputChange('referenceCode', e.target.value)}
          placeholder="e.g., M-025"
          className="w-full text-base touch-manipulation"
          required
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plate-number" className="text-sm sm:text-base font-medium">{t.plateNumber}</Label>
          <Input
            id="plate-number"
            value={formData.plateNumber}
            onChange={(e) => onInputChange('plateNumber', e.target.value)}
            placeholder="e.g., 002502-322-16"
            className="w-full text-base touch-manipulation"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm sm:text-base font-medium">{t.vanModel}</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => onInputChange('model', e.target.value)}
            placeholder="e.g., Ford Transit"
            className="w-full text-base touch-manipulation"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm sm:text-base font-medium">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
            <SelectTrigger className="w-full text-base touch-manipulation">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="En Transit">En Transit</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurer" className="text-sm sm:text-base font-medium">Assureur</Label>
          <Input
            id="insurer"
            value={formData.insurer}
            onChange={(e) => onInputChange('insurer', e.target.value)}
            placeholder="e.g., AXA, Allianz"
            className="w-full text-base touch-manipulation"
          />
        </div>
      </div>

      {/* New Location and Responsible Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="current-location" className="text-sm sm:text-base font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Localisation actuelle
          </Label>
          <Input
            id="current-location"
            value={formData.currentLocation}
            onChange={(e) => onInputChange('currentLocation', e.target.value)}
            placeholder="e.g., Dépôt Central, Chantier A"
            className="w-full text-base touch-manipulation"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-green-500" />
            Responsable actuel
          </Label>
          <Popover open={responsibleOpen} onOpenChange={setResponsibleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={responsibleOpen}
                className="w-full justify-between text-base touch-manipulation"
                disabled={usersLoading}
              >
                {selectedResponsible 
                  ? `${selectedResponsible.name}${selectedResponsible.email ? ` (${selectedResponsible.email})` : ''}`
                  : usersLoading 
                    ? "Chargement..." 
                    : "Sélectionner un responsable"
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher un utilisateur..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => {
                        onInputChange('currentResponsibleId', null);
                        setResponsibleOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !formData.currentResponsibleId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      Aucun responsable
                    </CommandItem>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${user.name} ${user.email || ''}`}
                        onSelect={() => {
                          onInputChange('currentResponsibleId', user.id);
                          setResponsibleOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.currentResponsibleId === user.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          {user.email && (
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Odometer */}
      <div className="space-y-2">
        <Label htmlFor="current-odometer" className="text-sm sm:text-base font-medium flex items-center gap-2">
          <Gauge className="h-4 w-4 text-purple-500" />
          Kilométrage actuel
        </Label>
        <Input
          id="current-odometer"
          type="number"
          value={formData.currentOdometerKm}
          onChange={(e) => onInputChange('currentOdometerKm', parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-full text-base touch-manipulation"
          min="0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-semibold">📅 Date d'Assurance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal text-base touch-manipulation"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.insuranceDate ? (
                  format(formData.insuranceDate, "PPP")
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.insuranceDate}
                onSelect={(date) => onDateChange('insuranceDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {isInsuranceExpired && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium text-sm">
                ⚠️ L'assurance a expiré le {format(formData.insuranceDate!, "dd/MM/yyyy")}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm sm:text-base font-semibold">🔧 Date de Contrôle Technique</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal text-base touch-manipulation"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.controlDate ? (
                  format(formData.controlDate, "PPP")
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.controlDate}
                onSelect={(date) => onDateChange('controlDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {isControlExpired && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium text-sm">
                ⚠️ Le contrôle technique a expiré le {format(formData.controlDate!, "dd/MM/yyyy")}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm sm:text-base font-medium">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder="Ajouter des notes ou commentaires..."
          className="w-full text-base touch-manipulation min-h-[100px] resize-y"
        />
      </div>
    </div>
  );
};

export default VanFormFields;
