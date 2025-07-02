
import React from 'react';
import { FilterBar } from '@/components/ui/filter-bar';

interface VansSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VansSearch = ({ searchTerm, onSearchChange }: VansSearchProps) => {
  return (
    <FilterBar
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Rechercher par plaque, modèle, référence..."
    />
  );
};

export default VansSearch;
