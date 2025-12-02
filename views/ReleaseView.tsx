
import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Play, Save, RefreshCw, UploadCloud, FileSpreadsheet, 
  Server, Database, Code, ShieldCheck, ChevronRight, Settings, 
  Check, X, FileCheck, Terminal, Plus, Trash2, ArrowUp, ArrowDown,
  MoreHorizontal, Layers, Briefcase, Zap, Info
} from 'lucide-react';
import { useStore } from '../store';
import { PipelineStep } from '../types';

const ReleaseView = () => {
  const { pipelineSteps, runPipeline } = useStore();
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentFlowName, setCurrentFlowName] = useState("Standard Release Flow");

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
    <div className="flex h-full relative">
      {/* Left Config Panel */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RocketIcon /> Release Pilot
          </h2>
          <button 
            onClick={() => setShowConfigModal(true)}
            className="p-1.5 rounded hover:bg-gray-700 text-blue-400 transition-colors"
            title="New Release Flow"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
             <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Current Flow</span>
                <button onClick={() => setShowConfigModal(true)} className="text-gray-400 hover:text-white"><Settings size={14}/></button>
             </div>
             <div className="font-medium text-white text-sm">{currentFlowName}</div>
             <div className="text-xs text-gray-500 mt-1">{pipelineSteps.length} Steps configured</div>
          </div>

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
          <button onClick={runPipeline} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20">
            <Play size={18} fill="currentColor" />
            Start Release Flow
          </button>
          <button className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
            <Save size={16} />
            Save as Template
          </button>
        </div>
      </div>

      {/* Main Workflow Area */}
      <div className="flex-1 bg-gray-900 p-8 overflow-y-auto">
        
        {/* Visual Pipeline */}
        <div className="mb-10 overflow-x-auto pb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Execution Pipeline</h3>
            <button 
              onClick={() => setShowConfigModal(true)} 
              className="flex items-center gap-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
            >
              <Settings size={14} /> Configure Pipeline
            </button>
          </div>
          
          <div className="flex items-center min-w-max px-2">
            {pipelineSteps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`relative group cursor-pointer transition-transform duration-200 ${activeStep === step.id ? 'transform scale-110' : 'hover:scale-105'}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-all ${getStatusColor(step.status)}`}>
                    <StatusIcon status={step.status} />
                  </div>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 text-center">
                    <p className={`text-xs font-bold ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-200'}`}>{step.title}</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mt-0.5">{step.type}</p>
                  </div>
                  
                  {/* Tooltip for step info */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48 bg-gray-800 text-xs text-gray-300 p-2 rounded border border-gray-700 shadow-xl text-center pointer-events-none">
                     Click to view details
                  </div>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded-full ${pipelineSteps[idx].status === 'completed' ? 'bg-green-500' : 'bg-gray-800'}`} />
                )}
              </div>
            ))}
             <button 
                onClick={() => setShowConfigModal(true)}
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 border-dashed hover:border-blue-500 hover:text-blue-500 text-gray-500 flex items-center justify-center ml-4 transition-colors"
              >
                <Plus size={16} />
              </button>
          </div>
        </div>

        {/* Detailed Status / Log Panel */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-0 overflow-hidden flex flex-col h-96 shadow-lg">
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Terminal size={18} className="text-blue-400" />
                Live Console
              </h3>
              <span className="text-xs bg-black/40 text-gray-400 px-2 py-1 rounded border border-gray-700 font-mono">tail -f build.log</span>
            </div>
            <div className="p-4 font-mono text-xs md:text-sm text-gray-300 overflow-y-auto flex-1 space-y-1.5 bg-[#0c0c0c]">
              <p className="text-green-400">➜ [System] Initializing pipeline sequence...</p>
              {pipelineSteps.map(step => 
                step.log.map((line, lIdx) => (
                  <p key={`${step.id}-${lIdx}`} className="pl-2 border-l-2 border-gray-800 hover:border-gray-600 hover:bg-white/5 transition-colors py-0.5">
                    <span className="text-blue-400 font-bold">[{step.type}]</span> {line}
                  </p>
                ))
              )}
              {pipelineSteps.some(s => s.status === 'running') && (
                <p className="animate-pulse text-yellow-500 font-bold mt-2">➜ Executing current task...</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 h-96 overflow-y-auto shadow-lg">
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

      {/* Configuration Modal */}
      {showConfigModal && (
        <ReleaseConfigModal 
          onClose={() => setShowConfigModal(false)} 
          initialFlowName={currentFlowName}
        />
      )}
    </div>
  );
};

// Internal Components

const ReleaseConfigModal = ({ onClose, initialFlowName }: { onClose: () => void, initialFlowName: string }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'steps'>('steps');
  const [flowName, setFlowName] = useState(initialFlowName);
  const [steps, setSteps] = useState<any[]>([
    { id: '1', title: 'Version & Config', type: 'FILE_OP' },
    { id: '2', title: 'Jenkins Build', type: 'JENKINS' },
    { id: '3', title: 'Package Structure', type: 'FILE_OP' },
    { id: '4', title: 'SVN Commit', type: 'SVN' },
    { id: '5', title: 'Upload Cloud', type: 'CLOUD' },
    { id: '6', title: 'PLM Sync', type: 'PLM' },
  ]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(steps[0]?.id || null);

  const handleAddStep = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setSteps([...steps, { id: newId, title: 'New Step', type: 'FILE_OP' }]);
    setSelectedStepId(newId);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
    if (selectedStepId === id) setSelectedStepId(null);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    
    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setSteps(newSteps);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8">
      <div className="bg-gray-800 w-full max-w-6xl h-[85vh] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-400" fill="currentColor" size={20} />
              Configure Release Pipeline
            </h2>
            <p className="text-xs text-gray-500 mt-1">Define steps and parameters for your release automation.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-900/50">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'general' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Briefcase size={16} /> General Info
          </button>
          <button 
            onClick={() => setActiveTab('steps')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'steps' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Layers size={16} /> Pipeline Steps
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'general' ? (
            <div className="p-8 w-full max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Flow Name</label>
                  <input 
                    type="text" 
                    value={flowName} 
                    onChange={(e) => setFlowName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
                    defaultValue="Standard release process for backend services. Includes Jenkins build, SVN tagging, and PLM synchronization."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Target Environment</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none">
                    <option>Production</option>
                    <option>Staging</option>
                    <option>Development</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full">
              {/* Left: Step List */}
              <div className="w-1/3 border-r border-gray-700 bg-gray-900/30 flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Execution Order</span>
                  <button onClick={handleAddStep} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium">
                    <Plus size={14} /> Add Step
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {steps.map((step, idx) => (
                    <div 
                      key={step.id}
                      onClick={() => setSelectedStepId(step.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${selectedStepId === step.id ? 'bg-blue-600/20 border-blue-500/50' : 'bg-gray-800 border-transparent hover:border-gray-600'}`}
                    >
                      <div className="flex flex-col items-center justify-center gap-1 text-gray-500">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleMoveStep(idx, 'up'); }}
                           className="hover:text-white disabled:opacity-30" disabled={idx === 0}
                         >
                           <ArrowUp size={12} />
                         </button>
                         <span className="text-[10px] font-mono">{idx + 1}</span>
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleMoveStep(idx, 'down'); }}
                           className="hover:text-white disabled:opacity-30" disabled={idx === steps.length - 1}
                         >
                           <ArrowDown size={12} />
                         </button>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${selectedStepId === step.id ? 'text-white' : 'text-gray-300'}`}>{step.title}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">{step.type}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id); }}
                        className="p-1.5 text-gray-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Step Configuration (Sub-flow Editor) */}
              <div className="flex-1 bg-gray-900 flex flex-col">
                 {selectedStepId ? (
                   <StepConfigPanel 
                     step={steps.find(s => s.id === selectedStepId)} 
                     updateStep={(updates) => {
                       setSteps(steps.map(s => s.id === selectedStepId ? { ...s, ...updates } : s));
                     }} 
                   />
                 ) : (
                   <div className="flex-1 flex items-center justify-center text-gray-500">
                     Select a step to configure details
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-700 font-medium transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-colors">
            Save Flow Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

const StepConfigPanel = ({ step, updateStep }: { step: any, updateStep: (u: any) => void }) => {
  if (!step) return null;

  const renderConfigFields = () => {
    switch (step.type) {
      case 'INIT':
        return (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Version Name</label>
                   <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" placeholder="e.g. 1.0.2" defaultValue={step.versionName || ''} onChange={(e) => updateStep({ versionName: e.target.value })} />
                </div>
                 <div>
                   <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Base Version</label>
                   <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" placeholder="e.g. 1.0.0" defaultValue={step.baseVersion || ''} onChange={(e) => updateStep({ baseVersion: e.target.value })} />
                </div>
             </div>
             
             <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Features (CSV)</label>
                <textarea className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white h-20 resize-none" placeholder="Feature A, Feature B..." defaultValue={step.features || ''} onChange={(e) => updateStep({ features: e.target.value })} />
             </div>

             <div>
               <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Worker Info</label>
               <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" placeholder="Worker Name / ID" defaultValue={step.workerInfo || ''} onChange={(e) => updateStep({ workerInfo: e.target.value })} />
             </div>

             <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Project Description</label>
                <textarea className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white h-20 resize-none" placeholder="Description of the release..." defaultValue={step.description || ''} onChange={(e) => updateStep({ description: e.target.value })} />
             </div>
             
             <div>
               <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Local Source Path</label>
               <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" placeholder="/path/to/source" defaultValue={step.localSourcePath || ''} onChange={(e) => updateStep({ localSourcePath: e.target.value })} />
             </div>

             <div>
               <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Exec Script</label>
               <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" placeholder="./init.sh" defaultValue={step.execScript || ''} onChange={(e) => updateStep({ execScript: e.target.value })} />
             </div>
          </div>
        );
      case 'JENKINS':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Jenkins Server</label>
              <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                <option>Build-Server-01 (10.0.0.5)</option>
                <option>Legacy-Build-02</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Job Name</label>
              <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" defaultValue="E-Commerce-Core-Build" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Build Token</label>
                <input type="password" value="******" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Timeout (mins)</label>
                <input type="number" defaultValue={30} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white" />
              </div>
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" className="rounded bg-gray-700 border-gray-600" defaultChecked />
                Wait for build completion
              </label>
            </div>
          </div>
        );
      case 'SVN':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Repository URL</label>
              <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" defaultValue="svn://repo.corp/ecommerce/trunk" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Target Path (Tag)</label>
              <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" defaultValue="tags/releases/{version}" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Commit Message</label>
              <textarea className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white h-20" defaultValue="[Release] Automated tag creation for {version}" />
            </div>
          </div>
        );
      case 'FILE_OP':
        return (
          <div className="space-y-4">
            <div>
               <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Operation</label>
               <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white">
                 <option>Create Directory Structure</option>
                 <option>Copy Artifacts</option>
                 <option>Zip/Archive</option>
                 <option>Cleanup</option>
               </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Source Path</label>
              <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" defaultValue="./build/output/*" />
            </div>
             <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Destination Path</label>
              <input type="text" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white font-mono" defaultValue="./release/{version}/EXE" />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 border border-dashed border-gray-700 rounded-lg text-center text-gray-500">
            Configuration fields for {step.type} will appear here.
          </div>
        );
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6 pb-4 border-b border-gray-700">
        <label className="block text-xs font-semibold text-blue-400 uppercase mb-1">Step Name</label>
        <input 
          type="text" 
          value={step.title}
          onChange={(e) => updateStep({ title: e.target.value })}
          className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 text-white placeholder-gray-600"
          placeholder="Step Title"
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Step Type</label>
        <select 
          value={step.type}
          onChange={(e) => updateStep({ type: e.target.value })}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
        >
          <option value="INIT">Initialization & Config</option>
          <option value="JENKINS">Jenkins Build Job</option>
          <option value="SVN">SVN Operation</option>
          <option value="FILE_OP">File System Operation</option>
          <option value="CLOUD">Cloud Upload</option>
          <option value="PLM">PLM Sync</option>
          <option value="EXCEL">Excel Report</option>
          <option value="NOTIFY">Notification</option>
        </select>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-1">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 px-1">Parameters</h4>
        {renderConfigFields()}
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

const RocketIcon = () => <div className="text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>;

export default ReleaseView;
