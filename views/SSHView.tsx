import React, { useState, useRef, useEffect } from 'react';
import { 
  Server, Folder, File, Download, Upload, Terminal as TerminalIcon, 
  MoreVertical, RefreshCw, Plus, Search, Command, FileText,
  Save, History, Trash2, X, Edit, Info, Key, Lock, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useStore } from '../store';
import { ServerNode } from '../types';

const SSHView = () => {
  const { servers, toggleServerStatus, addServer } = useStore();
  const [selectedServer, setSelectedServer] = useState<ServerNode | null>(servers[0] || null);
  const [activeTab, setActiveTab] = useState<'files' | 'terminal' | 'script'>('files');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newServerForm, setNewServerForm] = useState({ 
    name: '', 
    host: '', 
    username: 'root', 
    port: '22', 
    tags: '',
    description: '',
    authType: 'password' as 'password' | 'privateKey',
    password: '',
    privateKey: ''
  });
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const resetForm = () => {
    setNewServerForm({ 
      name: '', 
      host: '', 
      username: 'root', 
      port: '22', 
      tags: '',
      description: '',
      authType: 'password',
      password: '',
      privateKey: ''
    });
    setTestConnectionStatus('idle');
  };

  const handleTestConnection = async () => {
    if (!newServerForm.host) return;
    setTestConnectionStatus('testing');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random success/fail for demo purposes, or success if host is localhost/127.0.0.1
    const success = Math.random() > 0.2;
    setTestConnectionStatus(success ? 'success' : 'failed');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerForm.name || !newServerForm.host) return;
    
    addServer({
      name: newServerForm.name,
      host: newServerForm.host,
      username: newServerForm.username,
      port: parseInt(newServerForm.port) || 22,
      tags: newServerForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      description: newServerForm.description,
      authType: newServerForm.authType
    });
    
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="flex h-full bg-gray-900 relative">
      {/* Server List Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold text-white">Connections</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-blue-400 hover:bg-gray-700 p-1 rounded transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="p-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Filter servers..." 
              className="w-full bg-gray-900 border border-gray-700 rounded pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-1">
            {servers.map(server => (
              <div 
                key={server.id}
                onClick={() => setSelectedServer(server)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedServer?.id === server.id ? 'bg-blue-600/20 border border-blue-600/50' : 'hover:bg-gray-700 border border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${server.status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
                  <div className="overflow-hidden">
                    <p className={`text-sm font-medium truncate ${selectedServer?.id === server.id ? 'text-white' : 'text-gray-300'}`}>{server.name}</p>
                    <p className="text-xs text-gray-500 truncate">{server.username}@{server.host}:{server.port}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleServerStatus(server.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedServer ? (
          <>
            {/* Server Header */}
            <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <Server size={20} className={selectedServer.status === 'connected' ? 'text-green-500' : 'text-gray-500'} />
                <div>
                  <h1 className="font-bold text-lg text-white leading-tight">{selectedServer.name}</h1>
                  <span className="text-xs text-gray-500 font-mono">
                    {selectedServer.username}@{selectedServer.host}:{selectedServer.port} 
                    {selectedServer.description && <span className="text-gray-600 ml-2 border-l border-gray-700 pl-2">{selectedServer.description}</span>}
                  </span>
                </div>
              </div>
              <div className="flex bg-gray-900 rounded-lg p-1">
                <TabButton active={activeTab === 'files'} onClick={() => setActiveTab('files')} icon={Folder} label="SFTP" />
                <TabButton active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={TerminalIcon} label="Terminal" />
                <TabButton active={activeTab === 'script'} onClick={() => setActiveTab('script')} icon={Command} label="Scripts" />
              </div>
            </div>

            {/* Workspace */}
            <div className="flex-1 bg-gray-900 p-0 overflow-hidden relative">
              {activeTab === 'files' && <FileManager />}
              {activeTab === 'terminal' && <TerminalEmulator />}
              {activeTab === 'script' && <ScriptEditor />}
            </div>
            
            {/* Transfer Bar */}
            <div className="h-8 bg-gray-800 border-t border-gray-700 flex items-center px-4 justify-between text-xs text-gray-400">
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-2"><Upload size={12} /> Idle</span>
                 <span className="flex items-center gap-2"><Download size={12} /> Idle</span>
               </div>
               <div>Latency: 45ms</div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a server to manage
          </div>
        )}
      </div>

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-[500px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server size={20} className="text-blue-500" />
                New Connection Profile
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="add-server-form" onSubmit={handleAddSubmit} className="space-y-5">
                {/* General Info */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase">Profile Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Production Web 01"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      value={newServerForm.name}
                      onChange={e => setNewServerForm({...newServerForm, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Hostname / IP <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. 192.168.1.55"
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                        value={newServerForm.host}
                        onChange={e => setNewServerForm({...newServerForm, host: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Port</label>
                      <input 
                        type="number" 
                        placeholder="22"
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                        value={newServerForm.port}
                        onChange={e => setNewServerForm({...newServerForm, port: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase">Description</label>
                    <textarea 
                      placeholder="Optional server description..."
                      rows={2}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                      value={newServerForm.description}
                      onChange={e => setNewServerForm({...newServerForm, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 my-4"></div>

                {/* Authentication */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-300">Authentication</h4>
                  
                  <div className="space-y-1.5">
                     <label className="text-xs font-medium text-gray-400 uppercase">Username <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="root"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                      value={newServerForm.username}
                      onChange={e => setNewServerForm({...newServerForm, username: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex rounded-lg bg-gray-900 p-1 w-full border border-gray-700">
                    <button
                      type="button"
                      onClick={() => setNewServerForm({...newServerForm, authType: 'password'})}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${newServerForm.authType === 'password' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Lock size={14} /> Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewServerForm({...newServerForm, authType: 'privateKey'})}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${newServerForm.authType === 'privateKey' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                      <Key size={14} /> Private Key
                    </button>
                  </div>

                  {newServerForm.authType === 'password' ? (
                     <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                        value={newServerForm.password}
                        onChange={e => setNewServerForm({...newServerForm, password: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Private Key (PEM/OpenSSH)</label>
                      <textarea 
                        placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                        rows={3}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
                        value={newServerForm.privateKey}
                        onChange={e => setNewServerForm({...newServerForm, privateKey: e.target.value})}
                      />
                      <button type="button" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Upload size={12} /> Load from file...
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 uppercase">Tags</label>
                  <input 
                    type="text" 
                    placeholder="e.g. prod, aws, linux"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    value={newServerForm.tags}
                    onChange={e => setNewServerForm({...newServerForm, tags: e.target.value})}
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-700 bg-gray-800 flex justify-between items-center gap-4">
               <button 
                  type="button"
                  onClick={handleTestConnection}
                  disabled={!newServerForm.host || testConnectionStatus === 'testing'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    testConnectionStatus === 'success' ? 'border-green-600 text-green-500 bg-green-900/10' :
                    testConnectionStatus === 'failed' ? 'border-red-600 text-red-500 bg-red-900/10' :
                    'border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {testConnectionStatus === 'testing' ? <Loader2 size={16} className="animate-spin" /> : 
                   testConnectionStatus === 'success' ? <CheckCircle2 size={16} /> : 
                   testConnectionStatus === 'failed' ? <AlertCircle size={16} /> :
                   <RefreshCw size={16} />}
                  {testConnectionStatus === 'testing' ? 'Testing...' : 
                   testConnectionStatus === 'success' ? 'Connected' : 
                   testConnectionStatus === 'failed' ? 'Failed' : 
                   'Test Connection'}
                </button>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    form="add-server-form"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium shadow-lg shadow-blue-900/20 transition-all"
                  >
                    Save Profile
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${active ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
  >
    <Icon size={14} />
    {label}
  </button>
);

const FileManager = () => {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, file: any } | null>(null);

  const files = [
    { name: 'app', type: 'dir', size: '-', date: '2023-10-01 12:00', perms: 'drwxr-xr-x' },
    { name: 'config', type: 'dir', size: '-', date: '2023-10-05 09:30', perms: 'drwxr-xr-x' },
    { name: 'logs', type: 'dir', size: '-', date: 'Today 10:15', perms: 'drwxr-xr-x' },
    { name: 'docker-compose.yml', type: 'file', size: '2.4 KB', date: '2023-09-20', perms: '-rw-r--r--' },
    { name: 'readme.md', type: 'file', size: '12 KB', date: '2023-08-15', perms: '-rw-r--r--' },
    { name: 'build_script.sh', type: 'file', size: '450 B', date: '2023-10-02', perms: '-rwxr-x---' },
    { name: 'error.log', type: 'file', size: '45 MB', date: 'Today 10:20', perms: '-rw-r--r--' },
  ];

  const handleContextMenu = (e: React.MouseEvent, file: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleAction = (action: string) => {
    console.log(`Executing ${action} on ${contextMenu?.file?.name}`);
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-gray-800/50 p-2 flex items-center gap-2 border-b border-gray-700">
        <button className="p-1 hover:bg-gray-700 rounded text-gray-400"><RefreshCw size={14} /></button>
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1 text-sm text-gray-300 font-mono">
          /opt/application/backend
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-500 sticky top-0">
            <tr>
              <th className="px-4 py-2 font-medium w-8"></th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium w-24">Size</th>
              <th className="px-4 py-2 font-medium w-32">Modified</th>
              <th className="px-4 py-2 font-medium w-24">Perms</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {files.map((f, i) => (
              <tr 
                key={i} 
                className="hover:bg-gray-800/50 cursor-pointer group select-none"
                onContextMenu={(e) => handleContextMenu(e, f)}
              >
                <td className="px-4 py-2 text-center">
                  {f.type === 'dir' ? <Folder size={16} className="text-blue-400 fill-blue-400/20" /> : <FileText size={16} className="text-gray-400" />}
                </td>
                <td className="px-4 py-2 text-white group-hover:text-blue-300">{f.name}</td>
                <td className="px-4 py-2 text-gray-500">{f.size}</td>
                <td className="px-4 py-2 text-gray-500">{f.date}</td>
                <td className="px-4 py-2 font-mono text-xs text-gray-600">{f.perms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <div 
          className="fixed z-50 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 overflow-hidden"
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 200), left: Math.min(contextMenu.x, window.innerWidth - 200) }}
        >
          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-700 font-medium truncate bg-gray-900/50">
            {contextMenu.file.name}
          </div>
          <button onClick={() => handleAction('download')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-200 transition-colors">
            <Download size={14} className="text-blue-400" /> Download
          </button>
          <button onClick={() => handleAction('upload')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-200 transition-colors">
            <Upload size={14} className="text-green-400" /> Upload Here
          </button>
          <div className="my-1 border-t border-gray-700" />
          <button onClick={() => handleAction('rename')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-200 transition-colors">
            <Edit size={14} className="text-yellow-400" /> Rename
          </button>
          <button onClick={() => handleAction('delete')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-200 transition-colors">
            <Trash2 size={14} className="text-red-400" /> Delete
          </button>
          <div className="my-1 border-t border-gray-700" />
          <button onClick={() => handleAction('properties')} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-200 transition-colors">
            <Info size={14} className="text-gray-400" /> Properties
          </button>
        </div>
      )}
    </div>
  );
};

const TerminalEmulator = () => {
  const [lines, setLines] = useState<{type: 'cmd' | 'out', content: string}[]>([
    { type: 'out', content: 'Welcome to DevOps Master Studio Terminal' },
    { type: 'out', content: 'Type "help" for available commands.' },
    { type: 'out', content: 'Ctrl+R to search history.' },
  ]);
  const [history, setHistory] = useState<string[]>(['ls -la', 'docker ps', 'git status', 'npm install']);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [historyPointer, setHistoryPointer] = useState<number | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isSearching]);

  // Keep focus on input
  useEffect(() => {
    if (!isSearching) inputRef.current?.focus();
  }, [isSearching]);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    setLines(prev => [...prev, { type: 'cmd', content: cmd }]);
    setHistory(prev => [...prev, cmd]);
    setHistoryPointer(null);

    // Simulated responses
    setTimeout(() => {
      let response = '';
      const command = cmd.trim().split(' ')[0];
      switch (command) {
        case 'ls': response = 'drwxr-xr-x 2 user user 4096 Oct 10 10:00 .\n-rw-r--r-- 1 user user  220 Oct 01 12:00 .bashrc'; break;
        case 'pwd': response = '/home/user/projects/devops-studio'; break;
        case 'whoami': response = 'root'; break;
        case 'date': response = new Date().toString(); break;
        case 'help': response = 'Available commands: ls, pwd, whoami, date, clear, help'; break;
        case 'clear': setLines([]); return;
        default: response = `bash: ${command}: command not found`;
      }
      if (response) setLines(prev => [...prev, { type: 'out', content: response }]);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault();
      setIsSearching(!isSearching);
      setSearchQuery('');
      return;
    }

    if (isSearching) {
      if (e.key === 'Escape') {
        setIsSearching(false);
        return;
      }
      if (e.key === 'Enter') {
        const match = getSearchMatch();
        if (match) {
          setInput(match); // Set matched command as current input
          setIsSearching(false);
          // Optional: execute immediately
          // executeCommand(match);
        }
        return;
      }
      return; // Let regular input handling work for search query
    }

    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newPointer = historyPointer === null ? history.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(newPointer);
      setInput(history[newPointer]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === null) return;
      const newPointer = Math.min(history.length, historyPointer + 1);
      if (newPointer === history.length) {
        setHistoryPointer(null);
        setInput('');
      } else {
        setHistoryPointer(newPointer);
        setInput(history[newPointer]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const getSearchMatch = () => {
    if (!searchQuery) return '';
    // Find last matching command (reverse search)
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].includes(searchQuery)) return history[i];
    }
    return '';
  };

  const handleSaveSession = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      history,
      lines
    };
    // In a real app, this would download a file. Here we mock it by saving to localStorage
    localStorage.setItem('ssh_session_latest', JSON.stringify(sessionData));
    setLines(prev => [...prev, { type: 'out', content: 'Session saved to local storage successfully.' }]);
  };

  const handleLoadSession = () => {
    const saved = localStorage.getItem('ssh_session_latest');
    if (saved) {
      const data = JSON.parse(saved);
      setHistory(data.history);
      setLines(data.lines);
      setLines(prev => [...prev, { type: 'out', content: `Session loaded from ${new Date(data.timestamp).toLocaleString()}` }]);
    } else {
      setLines(prev => [...prev, { type: 'out', content: 'No saved session found.' }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm">
      {/* Terminal Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-400">
          <TerminalIcon size={14} />
          <span className="text-xs">bash - 80x24</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSaveSession}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs transition-colors"
          >
            <Save size={12} /> Save Session
          </button>
          <button 
            onClick={handleLoadSession}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-xs transition-colors"
          >
            <History size={12} /> Load Session
          </button>
          <button 
            onClick={() => setLines([])}
            className="p-1 hover:bg-red-900/50 text-gray-500 hover:text-red-400 rounded transition-colors"
            title="Clear Terminal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-4 overflow-y-auto" onClick={() => !isSearching && inputRef.current?.focus()}>
        {lines.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap break-all">
            {line.type === 'cmd' ? (
              <span className="text-green-500">user@host:~$ <span className="text-white">{line.content}</span></span>
            ) : (
              <span className="text-gray-300">{line.content}</span>
            )}
          </div>
        ))}

        {/* Search Overlay or Active Input */}
        {isSearching ? (
          <div className="mt-2 text-gray-300 bg-gray-900 p-2 rounded border border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">(reverse-i-search)`{searchQuery}`:</span>
              <span className="text-white">{getSearchMatch() || <span className="text-red-500 text-xs italic">no match</span>}</span>
            </div>
            <input 
              autoFocus
              className="w-full bg-transparent outline-none text-transparent h-0" // Hidden input to capture typing for search query
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsSearching(false)}
            />
          </div>
        ) : (
          <div className="mt-1 flex items-center text-green-500">
            <span className="mr-2">user@host:~$</span>
            <input 
              ref={inputRef}
              className="flex-1 bg-transparent border-none outline-none text-white caret-gray-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      {/* Status Footer */}
      {isSearching && (
        <div className="px-4 py-1 bg-blue-900/30 text-blue-200 text-xs flex justify-between">
          <span>Search Mode Active</span>
          <span>ENTER to select • ESC to cancel</span>
        </div>
      )}
    </div>
  );
};

const ScriptEditor = () => (
  <div className="flex h-full">
    <div className="w-48 bg-gray-800 border-r border-gray-700 p-2">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Saved Scripts</div>
      <div className="space-y-1">
        <div className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded text-sm cursor-pointer">deploy_prod.sh</div>
        <div className="px-3 py-2 hover:bg-gray-700 text-gray-400 rounded text-sm cursor-pointer">cleanup_logs.sh</div>
        <div className="px-3 py-2 hover:bg-gray-700 text-gray-400 rounded text-sm cursor-pointer">db_backup.sh</div>
      </div>
    </div>
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      <div className="bg-gray-800 p-2 flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium px-2">deploy_prod.sh</span>
        <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium">
          <Command size={12} /> Exec Selection
        </button>
      </div>
      <div className="flex-1 p-4 font-mono text-sm text-gray-300">
        <p><span className="text-purple-400">#!/bin/bash</span></p>
        <p className="mt-2"><span className="text-gray-500"># Stop service</span></p>
        <p>systemctl stop myapp</p>
        <p className="mt-2"><span className="text-gray-500"># Backup</span></p>
        <p>cp -r /opt/myapp /opt/backups/myapp_$(date +%F)</p>
        <p className="mt-2"><span className="text-gray-500"># Update</span></p>
        <p>git pull origin master</p>
        <p>npm install</p>
        <p>npm run build</p>
        <p className="mt-2"><span className="text-gray-500"># Restart</span></p>
        <p>systemctl start myapp</p>
      </div>
    </div>
  </div>
);

export default SSHView;