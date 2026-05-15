import React from 'react';
import SourcePanel from './SourcePanel';
import { User, Bot } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
          isUser ? 'ml-3 bg-brand-600' : 'mr-3 bg-slate-800 border border-brand-500/30 glow-effect'
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-400" />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div 
            className={`px-5 py-4 shadow-md backdrop-blur-md ${
              isUser 
                ? 'bg-brand-600 text-white rounded-2xl rounded-tr-sm bg-gradient-to-br from-brand-500 to-brand-700' 
                : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-2xl rounded-tl-sm'
            }`}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 w-full">
              <SourcePanel sources={message.sources} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
