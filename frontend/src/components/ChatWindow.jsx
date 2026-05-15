import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: 'Namaste. I am AI Vaidya. Please initialize the knowledge base by uploading a document, then ask me anything about its contents.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ask', { question: userMessage.content });
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response.data.answer,
        sources: response.data.sources
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: "I'm sorry, I couldn't process your request. " + (error.response?.data?.detail || "Ensure the backend is running and a document is uploaded.")
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl flex flex-col h-[650px] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-900/10 to-transparent pointer-events-none"></div>
      
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/50 backdrop-blur-md">
        <h2 className="text-white font-semibold flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-brand-400" />
          Terminal
        </h2>
        <div className="flex items-center text-brand-300 text-xs font-mono bg-brand-950/50 px-3 py-1 rounded-full border border-brand-900">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse mr-2 glow-effect"></span>
          Ready
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scroll-smooth">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center text-brand-300 bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl rounded-tl-none shadow-sm w-fit max-w-[80%] backdrop-blur-sm">
            <Loader2 className="w-4 h-4 animate-spin mr-3 text-brand-500" />
            <span className="text-sm font-medium tracking-wide">Synthesizing answer...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-800 relative z-10 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative flex items-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-brand-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query the text..."
            className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all relative z-10 shadow-inner"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 z-20 bg-brand-600 hover:bg-brand-500 text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:hover:bg-brand-600 shadow-lg glow-effect"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
