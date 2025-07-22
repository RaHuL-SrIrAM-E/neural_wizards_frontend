import React, { useState, useCallback } from 'react';
import DocumentSidebar from './components/DocumentSidebar';
import ChatInterface from './components/ChatInterface';
import ParticleBackground from './components/ParticleBackground';
import Toast from './components/Toast';
import { Document, Message, ToastType } from './types';
import { API_CONFIG, buildApiUrl } from './config/api';

// Constants for error messages
const BACKEND_CONNECTION_ERROR = `Cannot connect to server. Make sure the Flask backend is running on ${API_CONFIG.BASE_URL}`;

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI document assistant. Upload some documents using the sidebar, and I'll help you analyze, summarize, and answer questions about them.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDocumentUpload = useCallback(async (file: File) => {
    // Validate file before upload
    if (!file) {
      showToast('No file selected', 'error');
      return;
    }

    if (file.size > API_CONFIG.UPLOAD.MAX_SIZE) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }

    const isValidType = API_CONFIG.UPLOAD.ALLOWED_TYPES.includes(file.type);
    const isValidExtension = API_CONFIG.UPLOAD.ALLOWED_EXTENSIONS.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidType && !isValidExtension) {
      showToast('Only PDF and DOCX files are supported', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST.TIMEOUT);
      
      const response = await fetch(buildApiUrl('UPLOAD'), {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          [API_CONFIG.REQUEST.HEADERS.NGROK_SKIP_WARNING]: 'true',
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const responseData = await response.json();
      
      if (responseData.success !== false) {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          status: 'processed',
        };
        
        setDocuments(prev => [...prev, newDoc]);
        showToast('Document uploaded successfully!', 'success');
      } else {
        throw new Error(responseData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showToast('Upload timed out. Please try again.', 'error');
        } else if (error.message.includes('Failed to fetch')) {
          showToast(BACKEND_CONNECTION_ERROR, 'error');
        } else {
          showToast(`Upload failed: ${error.message}`, 'error');
        }
      } else {
        showToast('Failed to upload document. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      setIsLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST.TIMEOUT);
      
      const response = await fetch(buildApiUrl('QUERY'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [API_CONFIG.REQUEST.HEADERS.NGROK_SKIP_WARNING]: 'true',
        },
        body: JSON.stringify({ query: content }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Query failed: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.answer || "I'm sorry, I couldn't process that request.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('No response from server');
      }
    } catch (error) {
      console.error('Query error:', error);
      
      let errorContent = "I'm having trouble connecting to the server. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorContent = "Request timed out. Please try again.";
        } else if (error.message.includes('Failed to fetch')) {
          errorContent = BACKEND_CONNECTION_ERROR;
        } else if (error.message.includes('Query failed')) {
          errorContent = `Server error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    showToast('Document deleted successfully', 'success');
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 flex h-screen">
        <DocumentSidebar
          documents={documents}
          onDocumentUpload={handleDocumentUpload}
          onDeleteDocument={handleDeleteDocument}
          isLoading={isLoading}
        />
        
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          hasDocuments={documents.length > 0}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;