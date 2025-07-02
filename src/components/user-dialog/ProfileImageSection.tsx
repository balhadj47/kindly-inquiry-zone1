
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

interface ProfileImageSectionProps {
  profileImage: string;
  userName: string;
  onImageChange: (url: string) => void;
  isSubmitting: boolean;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  profileImage,
  userName,
  onImageChange,
  isSubmitting,
}) => {
  const userInitials = userName
    ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
          <AvatarImage src={profileImage} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        {profileImage && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            disabled={isSubmitting}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('profile-image-upload')?.click()}
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          <Camera className="h-4 w-4" />
          <span>Changer la photo</span>
        </Button>
        
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProfileImageSection;
