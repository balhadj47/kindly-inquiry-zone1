
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface EmployeeUploadButtonProps {
  profileImage: string;
  uploading: boolean;
  isDisabled: boolean;
  onTriggerUpload: () => void;
}

const EmployeeUploadButton: React.FC<EmployeeUploadButtonProps> = ({
  profileImage,
  uploading,
  isDisabled,
  onTriggerUpload,
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onTriggerUpload}
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
          <span>{profileImage ? 'Remplacer la photo' : 'Télécharger une photo'}</span>
        </>
      )}
    </Button>
  );
};

export default EmployeeUploadButton;
