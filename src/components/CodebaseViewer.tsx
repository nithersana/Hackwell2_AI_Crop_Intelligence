import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  FileCode, 
  FolderTree
} from 'lucide-react';
import { STARTER_CODEBASE, CodeFile } from '../data/codebaseData';

export const CodebaseViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(STARTER_CODEBASE[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-lab flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="label">Starter Codebase & Implementation</div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1a1a1a] mt-1">
            Production Starter Microservice Package
          </h2>
          <p className="text-xs text-[#1a1a1a]/70 max-w-3xl leading-relaxed mt-1">
            Runnable Python microservice package implementing the simulated Computer Vision inferencing endpoint, 
            IoT telemetry ingestion endpoint, and adaptive multi-modal recommendation engine.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="btn-lab flex items-center space-x-2 shrink-0 shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
          <span>{copied ? 'Copied File' : `Copy ${selectedFile.filename}`}</span>
        </button>
      </div>

      {/* Codebase Explorer Layout */}
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xs">
        
        {/* Left: File Tree Sidebar */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[rgba(0,0,0,0.06)] p-4 bg-[#fafafa] space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(0,0,0,0.06)]">
            <span className="text-xs font-bold text-[#1a1a1a] flex items-center space-x-2">
              <FolderTree className="w-3.5 h-3.5 text-[#166534]" />
              <span>crop_intelligence_api/</span>
            </span>
            <span className="tag text-[9px]">Python 3.12</span>
          </div>

          <div className="space-y-1.5">
            {STARTER_CODEBASE.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xs text-xs transition-all flex flex-col space-y-1 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#166534] border border-[#166534] font-semibold shadow-xs'
                      : 'text-[#1a1a1a]/75 hover:bg-black/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-[#166534]' : 'text-[#1a1a1a]/40'}`} />
                      <span>{file.filename}</span>
                    </span>
                    <span className="tag text-[8px]">
                      {file.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#1a1a1a]/55 line-clamp-1 font-sans">
                    {file.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick Start Command Snippet */}
          <div className="mt-4 p-3 rounded-xs bg-white border border-[rgba(0,0,0,0.08)] space-y-1 text-[11px]">
            <div className="label text-[#1a1a1a]/60">Quick Start:</div>
            <div className="text-[#166534] font-bold select-all">$ pip install -r requirements.txt</div>
            <div className="text-[#1a1a1a]/80 select-all">$ uvicorn main:app --reload --port 8000</div>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#fdfdfd]">
          <div className="px-5 py-3 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-[#fafafa] font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#1a1a1a] font-bold">{selectedFile.filename}</span>
              <span className="text-xs text-[#1a1a1a]/40">•</span>
              <span className="text-xs text-[#1a1a1a]/60">{selectedFile.description}</span>
            </div>

            <button
              onClick={handleCopy}
              className="text-xs text-[#1a1a1a]/70 hover:text-[#1a1a1a] flex items-center space-x-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>

          <div className="p-5 overflow-x-auto max-h-[620px] text-xs font-mono leading-relaxed text-[#166534] selection:bg-[#166534]/15">
            <pre>{selectedFile.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
