import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Quote } from 'lucide-react';

export default function SourcePanel({ sources }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-slate-900/40 border border-brand-900/30 rounded-xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-sm text-slate-400 hover:text-brand-300 hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center font-medium">
          <BookOpen className="w-4 h-4 mr-2 text-brand-500" />
          Retrieved Context Passages ({sources.length})
        </span>
        <div className="bg-slate-800 p-1 rounded-full text-brand-400">
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-900/60 backdrop-blur-sm">
          {sources.map((source, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute inset-0 bg-brand-500/5 rounded-lg blur-sm group-hover:bg-brand-500/10 transition-colors"></div>
              <div className="relative bg-slate-800/80 p-4 rounded-lg border border-brand-900/50 text-sm text-slate-300 hover:border-brand-500/30 transition-colors">
                <Quote className="absolute top-3 right-3 w-5 h-5 text-brand-900/50" />
                <span className="inline-block text-[10px] font-bold text-brand-500 mb-2 uppercase tracking-widest bg-brand-950 px-2 py-0.5 rounded border border-brand-900/50">
                  Document Chunk {idx + 1}
                </span>
                <p className="leading-relaxed relative z-10 text-[13px]">{source}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
