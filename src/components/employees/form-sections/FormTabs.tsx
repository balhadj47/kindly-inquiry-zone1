
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
        <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200/60 rounded-xl shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="basic" 
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-200 data-[state=active]:text-blue-700 hover:bg-white/60 hover:scale-105"
              >
                <UserIcon className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Base</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-blue-900 text-white">
              <p>Informations de base</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="identity"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-purple-200 data-[state=active]:text-purple-700 hover:bg-white/60 hover:scale-105"
              >
                <IdCard className="h-4 w-4 text-purple-600" />
                <span className="hidden sm:inline">Identité</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-purple-900 text-white">
              <p>Documents d'identité</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="driver"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-green-200 data-[state=active]:text-green-700 hover:bg-white/60 hover:scale-105"
              >
                <Car className="h-4 w-4 text-green-600" />
                <span className="hidden sm:inline">Permis</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-green-900 text-white">
              <p>Permis de conduire</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="medical"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-red-200 data-[state=active]:text-red-700 hover:bg-white/60 hover:scale-105"
              >
                <Heart className="h-4 w-4 text-red-500" />
                <span className="hidden sm:inline">Médical</span>
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-red-900 text-white">
              <p>Informations médicales</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="mt-6 bg-gradient-to-br from-blue-50/50 to-slate-50/30 rounded-xl p-5 border border-blue-100 shadow-sm">
          <BasicInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Identity Documents Tab */}
        <TabsContent value="identity" className="mt-6 bg-gradient-to-br from-purple-50/50 to-slate-50/30 rounded-xl p-5 border border-purple-100 shadow-sm">
          <IdentityDocumentsSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Driver License Tab */}
        <TabsContent value="driver" className="mt-6 bg-gradient-to-br from-green-50/50 to-slate-50/30 rounded-xl p-5 border border-green-100 shadow-sm">
          <DriverLicenseSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
        
        {/* Medical Info Tab */}
        <TabsContent value="medical" className="mt-6 bg-gradient-to-br from-red-50/50 to-slate-50/30 rounded-xl p-5 border border-red-100 shadow-sm">
          <MedicalInfoSection control={control} isSubmitting={isSubmitting} />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};

export default FormTabs;
