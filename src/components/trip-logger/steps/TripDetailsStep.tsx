
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Calendar as CalendarIconLucide } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TripDetailsStepProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
}

const TripDetailsStep: React.FC<TripDetailsStepProps> = ({
  notes,
  onNotesChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
          <FileText className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Détails du voyage</h3>
        <p className="text-gray-600">Sélectionnez les dates de début et de fin du voyage</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIconLucide className="w-3 h-3 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Dates du voyage <span className="text-red-500">*</span></h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Date de début <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200 hover:border-blue-500",
                      !startDate && "text-muted-foreground border-red-300"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={onStartDateChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Date de fin <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200 hover:border-blue-500",
                      !endDate && "text-muted-foreground border-red-300"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={onEndDateChange}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-3 h-3 text-green-600" />
            </div>
            <Label htmlFor="notes" className="font-semibold text-gray-900">Notes</Label>
          </div>
          <Textarea
            id="notes"
            placeholder="Ajoutez des notes sur le voyage, les objectifs, les observations..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TripDetailsStep;
