
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [imageUrl, setImageUrl] = React.useState(profileImage || '');
  const [isEditing, setIsEditing] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSaveImage = () => {
    onImageChange(imageUrl);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setImageUrl(profileImage || '');
    setIsEditing(false);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onImageChange('');
    setIsEditing(false);
  };

  // Get user initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          📸 Photo de profil
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Image représentant l'utilisateur
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Avatar Display */}
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-border/50">
            <AvatarImage src={profileImage} alt={userName || 'User'} />
            <AvatarFallback className="text-xl font-semibold bg-muted text-muted-foreground">
              {userName ? getInitials(userName) : 'U'}
            </AvatarFallback>
          </Avatar>
          
          {!isEditing && (
            <Button
              type="button"
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Image URL Input (when editing) */}
        {isEditing && (
          <div className="w-full max-w-md space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">URL de l'image</label>
              <Input
                type="url"
                placeholder="https://exemple.com/image.jpg"
                value={imageUrl}
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleSaveImage}
                disabled={isSubmitting}
              >
                Enregistrer
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              {profileImage && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Info Text */}
        {!isEditing && (
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Cliquez sur l'icône caméra pour modifier la photo de profil
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileImageSection;
