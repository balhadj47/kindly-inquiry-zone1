
import React from 'react';
import { Control } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User as UserIcon, FileText, StickyNote } from 'lucide-react';
import { User } from '@/types/rbac';
import PersonalInfoSection from './PersonalInfoSection';
import DocumentsMedicalSection from './DocumentsMedicalSection';
import EmployeeNotesSection from '../notes/EmployeeNotesSection';

interface FormTabsProps {
  control: Control<any>;
  isSubmitting: boolean;
  employee?: User | null;
}

const FormTabs: React.FC<FormTabsProps> = ({
  control,
  isSubmitting,
  employee,
}) => {
  return (
    <TooltipProvider>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-lg border border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="personal" 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:text-blue-500"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Personnel</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Informations personnelles</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="documents"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm hover:text-purple-500"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Documents et informations médicales</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="notes"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm hover:text-green-500"
              >
                <StickyNote className="h-4 w-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Notes de l'employé</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          <PersonalInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Documents & Medical Tab */}
        <TabsContent value="documents" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          <DocumentsMedicalSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          {employee ? (
            <EmployeeNotesSection employee={employee} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              <StickyNote className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Les notes seront disponibles après la création de l'employé</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};

export default FormTabs;
