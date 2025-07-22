import React, { useCallback, useState } from 'react';
import { Upload, FileText, File, X } from 'lucide-react';
import { API_CONFIG } from '../config/api';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

function FileUpload({ onFileUpload, onClose, isLoading }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                     file.type === 'application/msword' || 
                     file.name.toLowerCase().endsWith('.docx') || 
                     file.name.toLowerCase().endsWith('.doc');
      return isPdf || isDocx;
    });

    if (files.length > 0 && !validFile) {
      // Show error for invalid file types
      return;
    }

    if (validFile && validFile.size > API_CONFIG.UPLOAD.MAX_SIZE) {
      // Show error for file too large
      return;
    }

    if (validFile) {
      setSelectedFile(validFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > API_CONFIG.UPLOAD.MAX_SIZE) {
        // Show error for file too large
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      try {
        await onFileUpload(selectedFile);
        setSelectedFile(null);
        onClose();
      } catch (error) {
        // Error handling is done in the parent component
        console.error('Upload failed:', error);
      }
    }
  }, [selectedFile, onFileUpload, onClose]);

  const getFileIcon = useCallback((file: File) => {
    if (file.type.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
    if (file.type.includes('word')) return <File className="w-8 h-8 text-blue-400" />;
    return <File className="w-8 h-8 text-gray-400" />;
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          dragOver ? 'text-blue-400' : 'text-gray-400'
        }`} />
        <p className="text-lg font-medium mb-2">
          {dragOver ? 'Drop your file here' : 'Drag & drop your document'}
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Support for PDF and DOCX files up to 10MB
        </p>
        <label className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          Choose File
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
        </label>
      </div>

      {selectedFile && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getFileIcon(selectedFile)}
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;