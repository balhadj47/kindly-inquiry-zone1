
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Building2, FileText, User, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Trip {
  id: number;
  created_at: string;
  van: string;
  driver: string;
  company: string;
  branch: string;
  notes?: string;
  user_ids?: string[];
}

interface VanTripsDialogProps {
  van: any;
  isOpen: boolean;
  onClose: () => void;
}

const VanTripsDialog: React.FC<VanTripsDialogProps> = ({ van, isOpen, onClose }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && van) {
      fetchVanTrips();
    }
  }, [isOpen, van]);

  const fetchVanTrips = async () => {
    setLoading(true);
    try {
      // Query trips directly from the trips table
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('van', van.license_plate)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching van trips:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les voyages de cette camionnette",
          variant: "destructive",
        });
        return;
      }

      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching van trips:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les voyages de cette camionnette",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', trip.id);

      if (error) {
        console.error('Error deleting trip:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le voyage",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Le voyage a été supprimé avec succès",
      });

      // Refresh the trips list
      fetchVanTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le voyage",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!van) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Voyages - {van.license_plate}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Chargement des voyages...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>Aucun voyage trouvé pour cette camionnette</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="font-mono">
                          #{trip.id}
                        </Badge>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDate(trip.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le voyage</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le voyage #{trip.id} ? 
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTrip(trip)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Chauffeur</p>
                        <p className="text-sm text-muted-foreground">{trip.driver}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Entreprise</p>
                        <p className="text-sm text-muted-foreground">{trip.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Agence</p>
                        <p className="text-sm text-muted-foreground">{trip.branch}</p>
                      </div>
                    </div>

                    {trip.user_ids && trip.user_ids.length > 0 && (
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Utilisateurs assignés</p>
                          <p className="text-sm text-muted-foreground">{trip.user_ids.length} personne(s)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {trip.notes && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex items-start space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium mb-1">Notes</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{trip.notes}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VanTripsDialog;
