
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Calendar as CalendarIcon, Wrench, AlertTriangle, Fuel, FileText, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VanLog } from '@/types/van';

interface VanMaintenanceLogsProps {
  vanId: string;
  vanModel: string;
}

const VanMaintenanceLogs: React.FC<VanMaintenanceLogsProps> = ({ vanId, vanModel }) => {
  const [logs, setLogs] = useState<VanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    odometer_km: '',
    category: 'maintenance' as const,
    title: '',
    details: '',
    cost: '',
    performed_by: '',
    next_due_km: '',
    next_due_date: undefined as Date | undefined,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, [vanId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('van_logs')
        .select('*')
        .eq('van_id', vanId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching van logs:', error);
        return;
      }

      setLogs((data || []) as VanLog[]);
    } catch (error) {
      console.error('Exception fetching van logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const logData = {
        van_id: vanId,
        date: formData.date.toISOString().split('T')[0],
        odometer_km: formData.odometer_km ? parseInt(formData.odometer_km) : null,
        category: formData.category,
        title: formData.title,
        details: formData.details || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        performed_by: formData.performed_by || null,
        next_due_km: formData.next_due_km ? parseInt(formData.next_due_km) : null,
        next_due_date: formData.next_due_date?.toISOString().split('T')[0] || null,
      };

      const { error } = await supabase
        .from('van_logs')
        .insert([logData]);

      if (error) {
        console.error('Error creating van log:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'entrée de maintenance",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Entrée de maintenance ajoutée avec succès",
      });

      // Reset form
      setFormData({
        date: new Date(),
        odometer_km: '',
        category: 'maintenance',
        title: '',
        details: '',
        cost: '',
        performed_by: '',
        next_due_km: '',
        next_due_date: undefined,
      });
      
      setIsAddingLog(false);
      fetchLogs();
    } catch (error) {
      console.error('Exception creating van log:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'repair': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'inspection': return <Settings className="h-4 w-4 text-green-500" />;
      case 'fuel': return <Fuel className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'fuel': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Historique de maintenance - {vanModel}
          </CardTitle>
          <Dialog open={isAddingLog} onOpenChange={setIsAddingLog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une entrée
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvelle entrée de maintenance</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.date, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kilométrage</Label>
                    <Input
                      type="number"
                      value={formData.odometer_km}
                      onChange={(e) => setFormData(prev => ({ ...prev, odometer_km: e.target.value }))}
                      placeholder="ex: 150000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Réparation</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="fuel">Carburant</SelectItem>
                        <SelectItem value="general">Général</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Coût (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                      placeholder="ex: 150.50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="ex: Vidange moteur, Changement pneus..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Détails</Label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Détails sur l'intervention..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Effectué par</Label>
                  <Input
                    value={formData.performed_by}
                    onChange={(e) => setFormData(prev => ({ ...prev, performed_by: e.target.value }))}
                    placeholder="ex: Garage Dupont, Équipe interne..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prochain entretien (km)</Label>
                    <Input
                      type="number"
                      value={formData.next_due_km}
                      onChange={(e) => setFormData(prev => ({ ...prev, next_due_km: e.target.value }))}
                      placeholder="ex: 160000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prochain entretien (date)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.next_due_date ? format(formData.next_due_date, "dd/MM/yyyy") : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.next_due_date}
                          onSelect={(date) => setFormData(prev => ({ ...prev, next_due_date: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddingLog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Ajouter l'entrée
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun historique de maintenance</p>
            <p className="text-sm">Commencez par ajouter une première entrée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(log.category)}
                    <h4 className="font-medium">{log.title}</h4>
                    <Badge className={getCategoryColor(log.category)}>
                      {log.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(log.date), "dd/MM/yyyy")}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {log.odometer_km && (
                    <div>
                      <span className="font-medium">Kilométrage:</span> {log.odometer_km.toLocaleString()} km
                    </div>
                  )}
                  {log.cost && (
                    <div>
                      <span className="font-medium">Coût:</span> {log.cost.toLocaleString()} €
                    </div>
                  )}
                  {log.performed_by && (
                    <div>
                      <span className="font-medium">Effectué par:</span> {log.performed_by}
                    </div>
                  )}
                </div>
                
                {log.details && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {log.details}
                  </div>
                )}
                
                {(log.next_due_km || log.next_due_date) && (
                  <div className="mt-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <span className="font-medium">Prochain entretien:</span>
                    {log.next_due_km && ` ${log.next_due_km.toLocaleString()} km`}
                    {log.next_due_km && log.next_due_date && ' ou '}
                    {log.next_due_date && format(new Date(log.next_due_date), "dd/MM/yyyy")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VanMaintenanceLogs;
