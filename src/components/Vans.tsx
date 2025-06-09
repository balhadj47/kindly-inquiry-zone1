
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVans } from '@/hooks/useVans';
import { supabase } from '@/integrations/supabase/client';
import VanModal from './VanModal';
import VanStats from './VanStats';
import VanFilters from './VanFilters';
import VanList from './VanList';
import VansLoadingSkeleton from './VansLoadingSkeleton';
import VanTripsDialog from './VanTripsDialog';

const Vans = React.memo(() => {
  console.log('🚐 Vans component: Rendering...');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('license_plate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [vanTripsDialogOpen, setVanTripsDialogOpen] = useState(false);
  const [selectedVanForTrips, setSelectedVanForTrips] = useState(null);
  const { toast } = useToast();
  const { vans, loading, error, refetch } = useVans();

  useEffect(() => {
    console.log('🚐 Vans component: Mounted');
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log('🚐 Vans component: Unmounting, was mounted for:', endTime - startTime, 'ms');
    };
  }, []);

  useEffect(() => {
    console.log('🚐 Vans component: Vans data changed, count:', vans.length);
  }, [vans]);

  // Memoize filtered and sorted vans with dependency array
  const filteredAndSortedVans = useMemo(() => {
    console.log('🚐 Vans component: Recalculating filtered vans');
    const startTime = performance.now();
    
    let filtered = vans.filter(van => {
      const matchesSearch = 
        van.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        van.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    // Sort vans
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const endTime = performance.now();
    console.log('🚐 Vans component: Filtering completed in:', endTime - startTime, 'ms');
    return filtered;
  }, [vans, searchTerm, sortField, sortDirection]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleAddVan = useCallback(() => {
    setSelectedVan(null);
    setIsModalOpen(true);
  }, []);

  const handleEditVan = useCallback((van: any) => {
    setSelectedVan(van);
    setIsModalOpen(true);
  }, []);

  const handleDeleteVan = useCallback(async (van: any) => {
    try {
      const { error } = await supabase
        .from('vans')
        .delete()
        .eq('id', van.id);

      if (error) {
        console.error('Error deleting van:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la camionnette",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: `La camionnette ${van.license_plate} a été supprimée avec succès`,
      });

      // Refresh the vans list
      refetch();
    } catch (error) {
      console.error('Error deleting van:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la camionnette",
        variant: "destructive",
      });
    }
  }, [toast, refetch]);

  const handleQuickAction = useCallback((action: string, van: any) => {
    if (action === 'Voir Voyages') {
      setSelectedVanForTrips(van);
      setVanTripsDialogOpen(true);
    } else {
      toast({
        title: "Action Effectuée",
        description: `Action ${action} effectuée sur ${van.license_plate}`,
      });
    }
  }, [toast]);

  const toggleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVan(null);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    console.log('🚐 Vans component: Showing loading skeleton');
    return <VansLoadingSkeleton />;
  }

  if (error) {
    console.log('🚐 Vans component: Showing error state');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  console.log('🚐 Vans component: Rendering main content with', vans.length, 'vans');

  return (
    <div className="space-y-6">
      <VanStats vans={vans} onAddVan={handleAddVan} />
      
      <VanFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
      />

      <VanList
        vans={filteredAndSortedVans}
        totalVans={vans.length}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onAddVan={handleAddVan}
        onEditVan={handleEditVan}
        onQuickAction={handleQuickAction}
        onDeleteVan={handleDeleteVan}
      />

      <VanModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        van={selectedVan}
        onSaveSuccess={handleSaveSuccess}
      />

      <VanTripsDialog
        van={selectedVanForTrips}
        isOpen={vanTripsDialogOpen}
        onClose={() => {
          setVanTripsDialogOpen(false);
          setSelectedVanForTrips(null);
        }}
      />
    </div>
  );
});

Vans.displayName = 'Vans';

export default Vans;
