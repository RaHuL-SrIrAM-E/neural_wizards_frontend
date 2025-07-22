export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'uploading' | 'processed' | 'error';
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';