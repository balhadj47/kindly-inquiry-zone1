
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { Van } from '@/hooks/useVans';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const hasActiveFilters = searchTerm !== '' || companyFilter !== 'all' || vanFilter !== 'all';

  return (
    <Card>
      <CardHeader className={isMobile ? 'pb-3' : ''}>
        <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>{t.filters}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search - Always visible */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.search}</label>
          <Input
            placeholder={t.searchByCompanyBranchVan}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={isMobile ? 'text-sm' : ''}
          />
        </div>

        {isMobile ? (
          /* Mobile: Collapsible filters */
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="w-full flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>{t.advancedFilters}</span>
              </div>
              {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {filtersExpanded && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.companies}</label>
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="text-sm">
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
                  <label className="text-sm font-medium">{t.van}</label>
                  <Select value={vanFilter} onValueChange={setVanFilter}>
                    <SelectTrigger className="text-sm">
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
            )}
          </div>
        ) : (
          /* Desktop: Horizontal filters */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium">{t.van}</label>
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
        )}

        {hasActiveFilters && (
          <Button 
            onClick={onClearFilters} 
            variant="outline" 
            size="sm"
            className={`flex items-center gap-2 ${isMobile ? 'w-full text-sm' : ''}`}
          >
            <RotateCcw className="h-4 w-4" />
            {t.clear}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TripHistoryFilters;
