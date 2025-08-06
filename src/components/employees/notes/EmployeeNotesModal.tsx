
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useEmployeeNotesMutations } from '@/hooks/useEmployeeNotes';
import { User as Employee } from '@/types/rbac';
import { cn } from '@/lib/utils';

interface EmployeeNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  note?: any;
  onSuccess: () => void;
}

const NOTE_CATEGORIES = [
  'General',
  'Performance', 
  'Training',
  'Disciplinary',
  'Recognition',
  'Medical',
  'Administrative'
];

const EmployeeNotesModal: React.FC<EmployeeNotesModalProps> = ({
  isOpen,
  onClose,
  employee,
  note,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    category: 'General',
    title: '',
    details: ''
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { createNote, updateNote, deleteNote } = useEmployeeNotesMutations();

  useEffect(() => {
    if (note) {
      setFormData({
        date: new Date(note.date),
        category: note.category,
        title: note.title,
        details: note.details || ''
      });
    } else {
      setFormData({
        date: new Date(),
        category: 'General',
        title: '',
        details: ''
      });
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre est requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      const noteData = {
        employee_id: parseInt(employee.id),
        date: format(formData.date, 'yyyy-MM-dd'),
        category: formData.category,
        title: formData.title.trim(),
        details: formData.details.trim() || null
      };

      if (note) {
        await updateNote.mutateAsync({ id: note.id, ...noteData });
        toast({
          title: 'Succès',
          description: 'Note mise à jour avec succès',
        });
      } else {
        await createNote.mutateAsync(noteData);
        toast({
          title: 'Succès',
          description: 'Note ajoutée avec succès',
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving employee note:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de sauvegarder la note',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    
    try {
      await deleteNote.mutateAsync(note.id);
      toast({
        title: 'Succès',
        description: 'Note supprimée avec succès',
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error deleting employee note:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer la note',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {note ? 'Modifier la note' : 'Ajouter une note'} - {employee.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "dd/MM/yyyy") : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, date }));
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la note"
              required
            />
          </div>

          <div>
            <Label htmlFor="details">Détails</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Détails optionnels..."
              rows={4}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {note && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteNote.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={createNote.isPending || updateNote.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {note ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeNotesModal;
