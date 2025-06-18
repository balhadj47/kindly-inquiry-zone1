
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface VansSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VansSearch = ({ searchTerm, onSearchChange }: VansSearchProps) => {
  return (
    <Card>
      <CardContent className="p-4 sm:pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par plaque, modèle, référence..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-base touch-manipulation"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VansSearch;
