
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { Van } from '@/types/van';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VanNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  van: Van;
  onSuccess: () => void;
}

const VanNotesModal: React.FC<VanNotesModalProps> = ({
  isOpen,
  onClose,
  van,
  onSuccess
}) => {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (van.notes) {
      setNotes(van.notes);
    } else {
      setNotes('');
    }
  }, [van.notes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('vans')
        .update({ notes: notes.trim() || null })
        .eq('id', van.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Succès',
        description: 'Note mise à jour avec succès',
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error updating van notes:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour la note',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Notes - {van.model || 'Véhicule'} ({van.license_plate || 'Sans plaque'})
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes ici..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VanNotesModal;
