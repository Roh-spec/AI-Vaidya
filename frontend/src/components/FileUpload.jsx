import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, Loader2 } from 'lucide-react';

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    setMessage('Synthesizing document data...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus('success');
      setMessage(response.data.message);
      if (onUploadSuccess) onUploadSuccess();
      
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Failed to upload document');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <div className="w-full relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 hover:border-brand-500 border-dashed rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/80 transition-all overflow-hidden group-hover:glow-effect">
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
            {file ? (
              <>
                <div className="w-12 h-12 bg-brand-900/50 rounded-full flex items-center justify-center mb-3 border border-brand-500/30">
                  <CheckCircle className="text-brand-400 w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-brand-300 truncate max-w-[200px] px-4">{file.name}</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="text-slate-400 group-hover:text-brand-400 w-6 h-6 transition-colors" />
                </div>
                <p className="mb-1 text-sm text-slate-300"><span className="font-semibold text-brand-400">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">PDF Documents Only</p>
              </>
            )}
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
        </label>
      </div>

      {file && status !== 'success' && (
        <button 
          onClick={handleUpload}
          disabled={status === 'uploading'}
          className="mt-6 w-full relative group overflow-hidden rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400"></div>
          <div className="relative flex items-center justify-center px-6 py-3 font-medium text-white transition-all bg-black/20 hover:bg-transparent">
            {status === 'uploading' ? (
              <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Processing...</>
            ) : (
              'Initialize Knowledge Base'
            )}
          </div>
        </button>
      )}

      {status === 'success' && (
        <div className="mt-6 flex items-center text-brand-300 font-medium bg-brand-950/40 border border-brand-800/50 p-4 rounded-xl w-full justify-center shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
          <CheckCircle className="w-5 h-5 mr-3 text-brand-500" />
          {message}
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-6 text-red-300 text-sm bg-red-950/40 border border-red-900/50 p-4 rounded-xl w-full">
          {message}
        </div>
      )}
    </div>
  );
}
