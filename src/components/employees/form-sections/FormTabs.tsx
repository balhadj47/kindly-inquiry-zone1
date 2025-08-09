
import React from 'react';
import { Control } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Contact, FileText, Briefcase, StickyNote } from 'lucide-react';
import PersonalInfoTab from './PersonalInfoTab';
import DocumentsTab from './DocumentsTab';
import ProfessionalTab from './ProfessionalTab';
import EmployeeNotesTab from './EmployeeNotesTab';
import { FormData } from './FormDataHelpers';

interface FormTabsProps {
  control: Control<FormData>;
  isSubmitting: boolean;
  employee?: any; // Pass the employee data for the notes tab
}

const FormTabs: React.FC<FormTabsProps> = ({ control, isSubmitting, employee }) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
        <TabsTrigger value="personal" className="flex items-center gap-2 text-xs sm:text-sm">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Personnel</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2 text-xs sm:text-sm">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Documents</span>
        </TabsTrigger>
        <TabsTrigger value="professional" className="flex items-center gap-2 text-xs sm:text-sm">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Professionnel</span>
        </TabsTrigger>
        {employee && (
          <TabsTrigger value="notes" className="flex items-center gap-2 text-xs sm:text-sm">
            <StickyNote className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        <PersonalInfoTab control={control} isSubmitting={isSubmitting} />
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <DocumentsTab control={control} isSubmitting={isSubmitting} />
      </TabsContent>

      <TabsContent value="professional" className="mt-6">
        <ProfessionalTab control={control} isSubmitting={isSubmitting} />
      </TabsContent>

      {employee && (
        <TabsContent value="notes" className="mt-6">
          <EmployeeNotesTab employee={employee} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default FormTabs;
