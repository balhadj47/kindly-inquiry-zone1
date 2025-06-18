
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import VanCard from './VanCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Van } from '@/types/van';
import { useVansPagination } from '@/hooks/useVansPagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface VanListProps {
  vans: any[];
  totalVans: number;
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
  onEditVan: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
  onDeleteVan: (van: any) => void;
}

const VanList = React.memo(({ 
  vans, 
  totalVans, 
  searchTerm, 
  statusFilter, 
  onAddVan, 
  onEditVan, 
  onQuickAction,
  onDeleteVan
}: VanListProps) => {
  const navigate = useNavigate();
  const [filteredVans, setFilteredVans] = useState(vans);
  
  const {
    currentPage,
    totalPages,
    paginatedVans,
    handlePageChange,
  } = useVansPagination({
    filteredVans,
    itemsPerPage: 10,
    searchTerm,
    statusFilter,
  });

  useEffect(() => {
    const filtered = vans.filter((van) => {
      if (searchTerm) {
        return van.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               van.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               van.model?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (statusFilter !== 'all') {
        return van.status === statusFilter;
      }
      return true;
    });
    setFilteredVans(filtered);
  }, [vans, searchTerm, statusFilter]);

  const handleVanClick = (van: Van) => {
    navigate(`/vans/${van.id}`);
  };

  if (vans.length === 0) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune camionnette trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? "Essayez d'ajuster votre recherche ou vos filtres" 
                  : "Commencez par ajouter votre première camionnette"
                }
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button onClick={onAddVan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Votre Première Camionnette
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis for large page counts
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (start > 2) {
          items.push(<PaginationEllipsis key="start-ellipsis" />);
        }
      }
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          items.push(<PaginationEllipsis key="end-ellipsis" />);
        }
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Affichage de {paginatedVans.length} sur {filteredVans.length} camionnettes (Page {currentPage} sur {totalPages})
      </div>
      
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginatedVans.map((van) => (
          <VanCard
            key={van.id}
            van={van}
            onEdit={onEditVan}
            onQuickAction={handleVanClick}
            onDelete={onDeleteVan}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
});

VanList.displayName = 'VanList';

export default VanList;
