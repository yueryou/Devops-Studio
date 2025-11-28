import React, { useState } from 'react';
import { 
  GitBranch, Play, Save, RefreshCw, UploadCloud, FileSpreadsheet, 
  Server, Database, Code, ShieldCheck, ChevronRight, Settings, 
  Check, X, FileCheck, Terminal
} from 'lucide-react';
import { useStore } from '../store';
import { PipelineStep } from '../types';

const ReleaseView = () => {
  const { pipelineSteps, runPipeline } = useStore();
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const StatusIcon = ({ status }: { status: PipelineStep['status'] }) => {
    switch(status) {
      case 'completed': return <Check size={16} className="text-white" />;
      case 'running': return <RefreshCw size={16} className="text-white animate-spin" />;
      case 'failed': return <X size={16} className="text-white" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    }
  };

  const getStatusColor = (status: PipelineStep['status']) => {
    switch(status) {
      case 'completed': return 'bg-green-500 border-green-600';
      case 'running': return 'bg-blue-500 border-blue-600';
      case 'failed': return 'bg-red-500 border-red-600';
      default: return 'bg-gray-700 border-gray-600';
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Config Panel */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 flex flex-col h-full overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <RocketIcon /> Release Config
        </h2>
        
        <div className="space-y-4 mb-8">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase">Project Name</label>
            <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none" defaultValue="E-Commerce Core" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase">Version Tag</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white" defaultValue="v2.4.0" />
              <button className="bg-gray-700 p-2 rounded hover:bg-gray-600 text-gray-300">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase">Baseline</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white outline-none">
              <option>Main_2023_Q4</option>
              <option>Hotfix_2.3.x</option>
            </select>
          </div>
           <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase">Release Owner</label>
            <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white" defaultValue="DevOps_Admin" />
          </div>
        </div>

        <div className="mt-auto">
          <button onClick={runPipeline} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
            <Play size={18} fill="currentColor" />
            Start Release Flow
          </button>
          <button className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
            <Save size={16} />
            Save Template
          </button>
        </div>
      </div>

      {/* Main Workflow Area */}
      <div className="flex-1 bg-gray-900 p-8 overflow-y-auto">
        
        {/* Visual Pipeline */}
        <div className="mb-10 overflow-x-auto pb-4">
          <h3 className="text-lg font-semibold text-white mb-6">Execution Pipeline</h3>
          <div className="flex items-center min-w-max">
            {pipelineSteps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`relative group cursor-pointer ${activeStep === step.id ? 'transform scale-105' : ''}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${getStatusColor(step.status)}`}>
                    <StatusIcon status={step.status} />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center">
                    <p className={`text-xs font-semibold ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-300'}`}>{step.title}</p>
                  </div>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded ${pipelineSteps[idx].status === 'completed' ? 'bg-green-500' : 'bg-gray-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Status / Log Panel */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-0 overflow-hidden flex flex-col h-96">
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Terminal size={18} className="text-blue-400" />
                Live Console
              </h3>
              <span className="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded">tail -f build.log</span>
            </div>
            <div className="p-4 font-mono text-sm text-gray-300 overflow-y-auto flex-1 space-y-1 bg-black/30">
              <p className="text-green-400">➜ [System] Initializing pipeline sequence...</p>
              {pipelineSteps.map(step => 
                step.log.map((line, lIdx) => (
                  <p key={`${step.id}-${lIdx}`} className="border-l-2 border-gray-700 pl-2">
                    <span className="text-blue-400">[{step.type}]</span> {line}
                  </p>
                ))
              )}
              {pipelineSteps.some(s => s.status === 'running') && (
                <p className="animate-pulse text-yellow-500">➜ Executing current task...</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 h-96 overflow-y-auto">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FileCheck size={18} className="text-purple-400" />
              Artifacts & Outputs
            </h3>
            <div className="space-y-3">
              <ArtifactItem title="Build Package" desc="E-Commerce_v2.4.0.zip (45MB)" icon={Code} status="Ready" />
              <ArtifactItem title="API Documentation" desc="Swagger_v2.docx" icon={FileSpreadsheet} status="Generated" />
              <ArtifactItem title="SQL Migration" desc="V2.4.0__Migration.sql" icon={Database} status="Ready" />
              <ArtifactItem title="PLM Record" desc="ID: REQ-2024-00458" icon={ShieldCheck} status="Pending Sync" />
              <ArtifactItem title="SVN Tag" desc="tags/releases/v2.4.0 (Rev: 45992)" icon={GitBranch} status="Committed" />
              <ArtifactItem title="Cloud Link" desc="https://cloud.corp/s/d9f8s7" icon={UploadCloud} status="Pending" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ArtifactItem = ({ title, desc, icon: Icon, status }: any) => (
  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-800 rounded group-hover:bg-gray-700">
        <Icon size={18} className="text-gray-400 group-hover:text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-200">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
    <span className={`text-xs px-2 py-1 rounded border ${status === 'Pending' ? 'border-yellow-900 text-yellow-500 bg-yellow-900/10' : 'border-green-900 text-green-500 bg-green-900/10'}`}>
      {status}
    </span>
  </div>
);

const RocketIcon = () => <Rocket size={24} className="text-blue-500" />;
import { Rocket } from 'lucide-react';

export default ReleaseView;