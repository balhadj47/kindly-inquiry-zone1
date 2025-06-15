
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { Van } from '@/hooks/useVans';
import { useLanguage } from '@/contexts/LanguageContext';

interface TripHistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  vanFilter: string;
  setVanFilter: (value: string) => void;
  companies: Company[];
  vans: Van[];
  onClearFilters: () => void;
}

const TripHistoryFilters: React.FC<TripHistoryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  companyFilter,
  setCompanyFilter,
  vanFilter,
  setVanFilter,
  companies,
  vans,
  onClearFilters
}) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.filters}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.search}</label>
            <Input
              placeholder={t.searchByCompanyBranchVan}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.companies}</label>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.allCompaniesFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allCompaniesFilter}</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Camionnette</label>
            <Select value={vanFilter} onValueChange={setVanFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.allVansFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allVansFilter}</SelectItem>
                {vans.map((van) => (
                  <SelectItem key={van.id} value={van.license_plate}>
                    {van.license_plate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onClearFilters} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t.clear}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripHistoryFilters;
