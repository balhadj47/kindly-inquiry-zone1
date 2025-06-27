
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

      // First try to create the bucket if it doesn't exist
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
      }

      console.log('Available buckets:', buckets);

      // Check if employee-avatars bucket exists, if not create it
      const employeeAvatarsBucket = buckets?.find(bucket => bucket.name === 'employee-avatars');
      
      if (!employeeAvatarsBucket) {
        console.log('Creating employee-avatars bucket...');
        const { data: newBucket, error: createBucketError } = await supabase.storage.createBucket('employee-avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        });

        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          throw createBucketError;
        }
        console.log('Bucket created successfully:', newBucket);
      }

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

      const { data } = supabase.storage
        .from('employee-avatars')
        .getPublicUrl(fileName);

      console.log('Employee image uploaded successfully, URL:', data.publicUrl);
      onImageChange(data.publicUrl);
      
      toast({
        title: 'Succès',
        description: 'Image téléchargée avec succès.',
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
            <span>Télécharger une photo</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default EmployeeImageUpload;
