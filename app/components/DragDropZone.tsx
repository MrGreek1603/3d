import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

interface DragDropZoneProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
}

export default function DragDropZone({ onImageSelect, selectedImage }: DragDropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      
      {selectedImage ? (
        <div className="relative w-full h-64">
          <Image
            src={selectedImage}
            alt="Selected"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-4xl">📸</div>
          <p className="text-gray-600">
            {isDragActive
              ? "Drop your image here..."
              : "Drag & drop an image here, or click to select"}
          </p>
        </div>
      )}
    </div>
  );
} 