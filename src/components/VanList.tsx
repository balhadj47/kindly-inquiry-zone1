
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import VanCard from './VanCard';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune camionnette trouvée</h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? "Essayez d'ajuster votre recherche ou vos filtres" 
                : "Commencez par ajouter votre première camionnette"
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={onAddVan} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Votre Première Camionnette
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Affichage de <span className="font-medium text-foreground">{paginatedVans.length}</span> sur{' '}
          <span className="font-medium text-foreground">{filteredVans.length}</span> camionnettes
        </div>
        <div className="text-xs text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </div>
      </div>
      
      {/* Vans Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
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
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                if (totalPages <= 5) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis logic for larger page counts
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                
                if (pageNumber === 1 && start > 1) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(1);
                        }}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                if (pageNumber === 2 && start > 2) {
                  return <PaginationEllipsis key="start-ellipsis" />;
                }
                
                if (pageNumber >= start && pageNumber <= end) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                if (pageNumber === totalPages - 1 && end < totalPages - 1) {
                  return <PaginationEllipsis key="end-ellipsis" />;
                }
                
                if (pageNumber === totalPages && end < totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
});

VanList.displayName = 'VanList';

export default VanList;
