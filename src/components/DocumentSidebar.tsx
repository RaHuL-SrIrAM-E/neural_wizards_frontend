import React, { useState, useCallback } from 'react';
import { FileText, Upload, Trash2, File, X } from 'lucide-react';
import FileUpload from './FileUpload';
import { Document } from '../types';

interface DocumentSidebarProps {
  documents: Document[];
  onDocumentUpload: (file: File) => Promise<void>;
  onDeleteDocument: (id: string) => void;
  isLoading: boolean;
}

function DocumentSidebar({ documents, onDocumentUpload, onDeleteDocument, isLoading }: DocumentSidebarProps) {
  const [showUpload, setShowUpload] = useState(false);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileIcon = useCallback((type: string) => {
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
    if (type.includes('word')) return <File className="w-4 h-4 text-blue-400" />;
    return <File className="w-4 h-4 text-gray-400" />;
  }, []);

  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Documents
          </h2>
          <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">
            {documents.length}
          </span>
        </div>
        
        <button
          onClick={() => setShowUpload(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-2">No documents uploaded yet</p>
            <p className="text-gray-500 text-xs">Upload PDF or DOCX files to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(doc.type)}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-white truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    doc.status === 'processed' ? 'bg-green-500/20 text-green-400' :
                    doc.status === 'uploading' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {doc.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FileUpload
              onFileUpload={onDocumentUpload}
              onClose={() => setShowUpload(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentSidebar;