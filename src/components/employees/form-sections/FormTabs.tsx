
import React from 'react';
import { Control } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User as UserIcon, IdCard, Car, Heart } from 'lucide-react';
import BasicInfoSection from './BasicInfoSection';
import IdentityDocumentsSection from './IdentityDocumentsSection';
import DriverLicenseSection from './DriverLicenseSection';
import MedicalInfoSection from '../../user-dialog/MedicalInfoSection';

interface FormTabsProps {
  control: Control<any>;
  isSubmitting: boolean;
}

const FormTabs: React.FC<FormTabsProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <TooltipProvider>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-100 rounded-lg border border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="basic" 
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:text-blue-500"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Base</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Informations de base</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="identity"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm hover:text-purple-500"
              >
                <IdCard className="h-4 w-4" />
                <span className="hidden sm:inline">Identité</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Documents d'identité</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="driver"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm hover:text-green-500"
              >
                <Car className="h-4 w-4" />
                <span className="hidden sm:inline">Permis</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Permis de conduire</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="medical"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm hover:text-red-500"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Médical</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Informations médicales</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          <BasicInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Identity Documents Tab */}
        <TabsContent value="identity" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          <IdentityDocumentsSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Driver License Tab */}
        <TabsContent value="driver" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          <DriverLicenseSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Medical Info Tab */}
        <TabsContent value="medical" className="mt-4 p-6 bg-white rounded-lg border border-gray-200">
          <MedicalInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};

export default FormTabs;
