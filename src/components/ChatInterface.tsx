import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Search } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ConnectionStatus from './ConnectionStatus';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  hasDocuments: boolean;
}

function ChatInterface({ messages, onSendMessage, isLoading, hasDocuments }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await onSendMessage(message);
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const sampleQuestions = [
    "Summarize the main points from my documents",
    "What are the key findings mentioned?",
    "Find specific information about...",
    "Compare the different sections",
    "Extract important quotes or data"
  ];

  const filteredMessages = searchTerm
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  return (
    <div className="flex-1 flex flex-col bg-black/10 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Document Assistant</h1>
              <p className="text-sm text-gray-400">
                {hasDocuments ? 'Ready to analyze your documents' : 'Upload documents to start chatting'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ConnectionStatus onStatusChange={setIsBackendConnected} />
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {!hasDocuments && (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Welcome to your AI Document Assistant</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Upload your PDF or DOCX documents using the sidebar, and I'll help you analyze, 
              summarize, and answer questions about them.
            </p>
            <div className="grid grid-cols-1 gap-2 max-w-lg mx-auto">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Try these sample questions:</h4>
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="text-left text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-colors text-gray-300 hover:text-white"
                >
                  "{question}"
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-6">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your documents..."
              disabled={!hasDocuments || isLoading}
              rows={1}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || !hasDocuments || isLoading || !isBackendConnected}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            Press Enter to send • Shift + Enter for new line
          </p>
          {!isBackendConnected && (
            <p className="text-xs text-red-400">
              Backend disconnected - check ngrok tunnel
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;