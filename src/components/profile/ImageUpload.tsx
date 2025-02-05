import React, { useState } from 'react';
import { FaCamera, FaCheck } from 'react-icons/fa';

interface ImageUploadProps {
  label: string;
  onUpload: (file: File) => void;
  isUploaded?: boolean;
}

export default function ImageUpload({ label, onUpload, isUploaded = false }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        ${isUploaded ? 'bg-green-50 border-green-500' : ''}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2">
        {isUploaded ? (
          <>
            <FaCheck className="text-green-500 text-2xl" />
            <span className="text-green-600 font-medium">Upload Complete</span>
          </>
        ) : (
          <>
            <FaCamera className="text-gray-400 text-2xl" />
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="text-sm text-gray-500">
              Click to upload or drag and drop
            </span>
          </>
        )}
      </div>
    </div>
  );
}