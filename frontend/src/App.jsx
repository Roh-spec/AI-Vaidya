import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChatWindow from './components/ChatWindow';

function App() {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-brand-500/30">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-10 border-b-0 border-t-0 border-l-0 border-r-0 border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center glow-effect shadow-brand-500/50">
              <span className="text-2xl drop-shadow-md">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                AI <span className="text-gradient">Vaidya</span>
              </h1>
              <p className="text-xs text-brand-400 font-medium uppercase tracking-widest mt-0.5">Ayurvedic Intelligence</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-brand-950/50 border border-brand-800/50 px-4 py-2 rounded-full text-xs font-medium text-brand-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Neural Engine Active
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Upload */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl">
              <h2 className="text-lg font-semibold mb-3 text-white flex items-center">
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 text-brand-400 text-sm">1</span>
                Initialization
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Establish the knowledge core by uploading a classical Ayurvedic text or research paper.
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
              <FileUpload onUploadSuccess={() => setIsReady(true)} />
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border border-brand-900/30 bg-gradient-to-b from-brand-950/40 to-transparent">
              <h3 className="text-sm font-semibold text-brand-300 mb-3 flex items-center">
                <span className="mr-2">✨</span> Sample Inquiries
              </h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2 mt-0.5">›</span> 
                  <span className="hover:text-brand-300 transition-colors cursor-pointer">What are the fundamental properties of the three doshas?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2 mt-0.5">›</span> 
                  <span className="hover:text-brand-300 transition-colors cursor-pointer">Describe the process of digestion (Agni) according to classical texts.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-500 mr-2 mt-0.5">›</span> 
                  <span className="hover:text-brand-300 transition-colors cursor-pointer">Which herbs are recommended for balancing Vata dosha?</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-8">
            <ChatWindow />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
