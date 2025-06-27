
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

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    console.log('📁 Starting Supabase upload for file:', file.name, file.type, file.size);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `employee_${timestamp}_${randomString}.${fileExtension}`;
    
    console.log('📝 Generated filename:', fileName);

    try {
      // Upload file to Supabase storage
      console.log('⬆️ Uploading to employee-avatars bucket...');
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('employee-avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Supabase upload error:', uploadError);
        throw new Error(`Failed to upload: ${uploadError.message}`);
      }

      console.log('✅ Upload successful:', uploadResult);

      // Get public URL
      const { data: urlResult } = supabase.storage
        .from('employee-avatars')
        .getPublicUrl(fileName);

      const publicUrl = urlResult.publicUrl;
      console.log('🔗 Generated public URL:', publicUrl);

      if (!publicUrl) {
        throw new Error('Failed to generate public URL');
      }

      return publicUrl;
    } catch (error) {
      console.error('💥 Error in uploadImageToSupabase:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎯 File input changed');
    
    const file = event.target.files?.[0];
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    console.log('📋 File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier image valide.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size, 'Max:', maxSize);
      toast({
        title: 'Erreur',
        description: 'L\'image ne doit pas dépasser 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    console.log('🚀 Starting upload process...');

    try {
      // Upload the image
      const imageUrl = await uploadImageToSupabase(file);
      
      // Update the form with new image URL
      console.log('📤 Calling onImageChange with URL:', imageUrl);
      onImageChange(imageUrl);
      
      toast({
        title: 'Succès',
        description: 'Image téléchargée avec succès!',
      });

      console.log('✅ Upload process completed successfully');
      
    } catch (error: any) {
      console.error('💥 Upload failed:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du téléchargement de l\'image.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      
      // Clear the input to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    console.log('🖱️ Triggering file input click');
    if (fileInputRef.current && !isDisabled) {
      fileInputRef.current.click();
    }
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
          onClick={triggerFileSelect}
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
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerFileSelect}
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
