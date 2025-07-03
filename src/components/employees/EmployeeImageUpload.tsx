
import React, { useRef, useState } from 'react';
import EmployeeAvatarDisplay from './image-upload/EmployeeAvatarDisplay';
import EmployeeUploadButton from './image-upload/EmployeeUploadButton';
import { useEmployeeImageUploader } from './image-upload/EmployeeImageUploader';

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
  
  const { handleFileUpload } = useEmployeeImageUploader({ onImageChange });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎯 File input changed');
    
    const file = event.target.files?.[0];
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    setUploading(true);

    try {
      await handleFileUpload(file);
    } catch (error) {
      // Error handling is done in the uploader hook
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

  // Debug log for current profileImage
  console.log('🖼️ Current profileImage in EmployeeImageUpload:', profileImage);

  return (
    <div className="flex flex-col items-center space-y-4">
      <EmployeeAvatarDisplay 
        profileImage={profileImage}
        userName={userName}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <EmployeeUploadButton
        profileImage={profileImage}
        uploading={uploading}
        isDisabled={isDisabled}
        onTriggerUpload={triggerFileSelect}
      />
    </div>
  );
};

export default EmployeeImageUpload;
