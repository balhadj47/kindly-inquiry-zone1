
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SidebarSearchProps {
  onSearch: (query: string) => void;
}

const SidebarSearch = ({ onSearch }: SidebarSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value.toLowerCase());
  };

  return (
    <div className="relative group-data-[collapsible=icon]:hidden">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search menu..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border focus:bg-background transition-colors"
      />
    </div>
  );
};

export default SidebarSearch;
