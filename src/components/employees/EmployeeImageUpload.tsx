
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmployeeImageUploadProps {
  profileImage: string;
  userName: string;
  onImageChange: (imageUrl: string) => void;
  isSubmitting: boolean;
}

const EmployeeImageUpload: React.FC<EmployeeImageUploadProps> = ({
  profileImage,
  userName,
  onImageChange,
  isSubmitting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier image valide.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erreur',
        description: 'L\'image ne doit pas dépasser 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `employee-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      console.log('Uploading employee image:', fileName);

      // If there's an existing image, try to delete it first
      if (profileImage && profileImage.includes('employee-avatars')) {
        try {
          // Extract the file path from the URL
          const urlParts = profileImage.split('/');
          const existingFileName = urlParts[urlParts.length - 1];
          
          console.log('Attempting to delete existing image:', existingFileName);
          
          const { error: deleteError } = await supabase.storage
            .from('employee-avatars')
            .remove([existingFileName]);
            
          if (deleteError) {
            console.warn('Could not delete existing image:', deleteError);
            // Don't throw error, just warn and continue with upload
          } else {
            console.log('Successfully deleted existing image');
          }
        } catch (deleteErr) {
          console.warn('Error during image deletion:', deleteErr);
          // Continue with upload even if deletion fails
        }
      }

      // Upload the new image
      const { error: uploadError } = await supabase.storage
        .from('employee-avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Get the public URL for the uploaded image
      const { data } = supabase.storage
        .from('employee-avatars')
        .getPublicUrl(fileName);

      console.log('Employee image uploaded successfully, URL:', data.publicUrl);
      
      // Update the form with the new image URL
      onImageChange(data.publicUrl);
      
      toast({
        title: 'Succès',
        description: 'Image mise à jour avec succès.',
      });
    } catch (error: any) {
      console.error('Error uploading employee image:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du téléchargement de l\'image.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const isDisabled = isSubmitting || uploading;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
            alt={userName}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {userName ? getUserInitials(userName) : 'EMP'}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          onClick={triggerImageUpload}
          disabled={isDisabled}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerImageUpload}
        disabled={isDisabled}
        className="flex items-center space-x-2"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Téléchargement...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <span>{profileImage ? 'Changer la photo' : 'Télécharger une photo'}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default EmployeeImageUpload;
