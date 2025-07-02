
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
        <TabsList className="grid w-full h-10 p-1 bg-muted/50 border border-border/50 grid-cols-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="basic" 
                className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <UserIcon className="h-3.5 w-3.5 text-blue-600" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Informations de base</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="identity"
                className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <IdCard className="h-3.5 w-3.5 text-purple-600" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Documents d'identité</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="driver"
                className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Car className="h-3.5 w-3.5 text-green-600" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Permis de conduire</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="medical"
                className="flex items-center justify-center py-2 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Heart className="h-3.5 w-3.5 text-red-500" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Informations médicales</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50">
          <BasicInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Identity Documents Tab */}
        <TabsContent value="identity" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50">
          <IdentityDocumentsSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Driver License Tab */}
        <TabsContent value="driver" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50">
          <DriverLicenseSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Medical Info Tab */}
        <TabsContent value="medical" className="mt-4 bg-card/50 rounded-lg p-3 sm:p-4 border border-border/50">
          <MedicalInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};

export default FormTabs;
