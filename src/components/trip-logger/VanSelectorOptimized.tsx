
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAvailableVans } from '@/hooks/useVansOptimized';
import { Skeleton } from '@/components/ui/skeleton';

interface Van {
  id: string;
  license_plate: string;
  model: string;
  reference_code?: string;
}

interface VanSelectorOptimizedProps {
  selectedVanId: string;
  onVanChange: (vanId: string) => void;
}

const VanSelectorOptimized: React.FC<VanSelectorOptimizedProps> = ({
  selectedVanId,
  onVanChange
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: availableVans = [], isLoading } = useAvailableVans();

  const getFilteredVans = () => {
    if (!searchQuery.trim()) {
      return availableVans;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return availableVans.filter(van => {
      if (!van) {
        return false;
      }
      
      const refCodeMatch = van.reference_code?.toLowerCase()?.includes(query);
      const plateMatch = van.license_plate?.toLowerCase()?.includes(query);
      const modelMatch = van.model?.toLowerCase()?.includes(query);
      
      return refCodeMatch || plateMatch || modelMatch;
    });
  };

  const filteredVans = getFilteredVans();

  return (
    <div className="space-y-3">
      <Label htmlFor="van">{t.selectVan}</Label>

      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select value={selectedVanId} onValueChange={onVanChange}>
          <SelectTrigger>
            <SelectValue placeholder={t.selectVan} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <div className="sticky top-0 bg-white p-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par référence, plaque ou modèle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredVans.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  {searchQuery ? 'Aucune camionnette trouvée' : 'Aucune camionnette disponible'}
                </div>
              ) : (
                filteredVans.map((van) => (
                  <SelectItem key={van.id} value={van.id}>
                    {van.reference_code || van.license_plate} - {van.model}
                  </SelectItem>
                ))
              )}
            </div>
          </SelectContent>
        </Select>
      )}
      
      {searchQuery && filteredVans.length !== availableVans.length && (
        <p className="text-sm text-muted-foreground">
          {filteredVans.length} van(s) trouvée(s) sur {availableVans.length} disponible(s)
        </p>
      )}
    </div>
  );
};

export default VanSelectorOptimized;
