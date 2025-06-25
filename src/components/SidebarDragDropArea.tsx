
import React from 'react';
import { Upload } from 'lucide-react';

const SidebarDragDropArea = () => {
  return (
    <div className="p-4 group-data-[collapsible=icon]:hidden">
      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
        <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2" />
        <p className="text-gray-500 text-xs">Drag-n-Drop to Upload</p>
      </div>
    </div>
  );
};

export default SidebarDragDropArea;
