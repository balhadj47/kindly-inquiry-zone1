
import React, { useState } from 'react';
import { Plus, FileText, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEmployeeNotes } from '@/hooks/useEmployeeNotes';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import { User as Employee } from '@/types/rbac';
import EmployeeNotesModal from './EmployeeNotesModal';
import { format } from 'date-fns';

interface EmployeeNotesSectionProps {
  employee: Employee;
}

const EmployeeNotesSection: React.FC<EmployeeNotesSectionProps> = ({ employee }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const { notes, isLoading, refetch } = useEmployeeNotes(parseInt(employee.id));
  const permissions = useEmployeePermissions();

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: any) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Performance': 'bg-blue-100 text-blue-800 border-blue-200',
      'Training': 'bg-green-100 text-green-800 border-green-200',
      'Disciplinary': 'bg-red-100 text-red-800 border-red-200',
      'Recognition': 'bg-purple-100 text-purple-800 border-purple-200',
      'Medical': 'bg-orange-100 text-orange-800 border-orange-200',
      'Administrative': 'bg-gray-100 text-gray-800 border-gray-200',
      'General': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[category as keyof typeof colors] || colors['General'];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des Notes
            {notes && notes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {notes.length}
              </Badge>
            )}
          </CardTitle>
          {permissions.canEditUsers && (
            <Button onClick={handleAddNote} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une note
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!notes || notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune note disponible pour cet employé</p>
              {permissions.canEditUsers && (
                <p className="text-sm mt-2">Cliquez sur "Ajouter une note" pour commencer</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => permissions.canEditUsers && handleEditNote(note)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getCategoryColor(note.category)} text-xs`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {note.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(note.date), 'dd/MM/yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{note.title}</h4>
                  
                  {note.details && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {note.details}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400 border-t pt-2">
                    <User className="h-3 w-3" />
                    <span>Ajouté le {format(new Date(note.created_at), 'dd/MM/yyyy à HH:mm')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EmployeeNotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={employee}
        note={selectedNote}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default EmployeeNotesSection;
