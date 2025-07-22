import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;