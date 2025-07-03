
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmployeeImageUploaderProps {
  onImageChange: (imageUrl: string) => void;
}

export const useEmployeeImageUploader = ({ onImageChange }: EmployeeImageUploaderProps) => {
  const { toast } = useToast();

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

  const handleFileUpload = async (file: File): Promise<void> => {
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
      throw new Error('Invalid file type');
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
      throw new Error('File too large');
    }

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
      throw error;
    }
  };

  return { handleFileUpload };
};
