import React, { useState } from 'react';
import { 
  Server, Folder, File, Download, Upload, Terminal as TerminalIcon, 
  MoreVertical, RefreshCw, Plus, Search, Command, FileText
} from 'lucide-react';
import { useStore } from '../store';
import { ServerNode } from '../types';

const SSHView = () => {
  const { servers, toggleServerStatus } = useStore();
  const [selectedServer, setSelectedServer] = useState<ServerNode | null>(servers[0] || null);
  const [activeTab, setActiveTab] = useState<'files' | 'terminal' | 'script'>('files');

  return (
    <div className="flex h-full bg-gray-900">
      {/* Server List Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold text-white">Connections</h2>
          <button className="text-blue-400 hover:bg-gray-700 p-1 rounded">
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
                  <div>
                    <p className={`text-sm font-medium ${selectedServer?.id === server.id ? 'text-white' : 'text-gray-300'}`}>{server.name}</p>
                    <p className="text-xs text-gray-500">{server.host}</p>
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
                <h1 className="font-bold text-lg text-white">{selectedServer.name}</h1>
                <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300 border border-gray-600 font-mono">{selectedServer.host}</span>
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
  const files = [
    { name: 'app', type: 'dir', size: '-', date: '2023-10-01 12:00', perms: 'drwxr-xr-x' },
    { name: 'config', type: 'dir', size: '-', date: '2023-10-05 09:30', perms: 'drwxr-xr-x' },
    { name: 'logs', type: 'dir', size: '-', date: 'Today 10:15', perms: 'drwxr-xr-x' },
    { name: 'docker-compose.yml', type: 'file', size: '2.4 KB', date: '2023-09-20', perms: '-rw-r--r--' },
    { name: 'readme.md', type: 'file', size: '12 KB', date: '2023-08-15', perms: '-rw-r--r--' },
    { name: 'build_script.sh', type: 'file', size: '450 B', date: '2023-10-02', perms: '-rwxr-x---' },
    { name: 'error.log', type: 'file', size: '45 MB', date: 'Today 10:20', perms: '-rw-r--r--' },
  ];

  return (
    <div className="flex flex-col h-full">
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
              <tr key={i} className="hover:bg-gray-800/50 cursor-pointer group">
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
    </div>
  );
};

const TerminalEmulator = () => (
  <div className="h-full bg-black p-4 font-mono text-sm overflow-y-auto">
    <div className="text-green-500">user@host:~$ <span className="text-white">ls -la</span></div>
    <div className="text-gray-300 whitespace-pre">
      drwxr-xr-x 2 user user 4096 Oct 10 10:00 .
      drwxr-xr-x 4 user user 4096 Oct 01 12:00 ..
      -rw-r--r-- 1 user user  220 Oct 01 12:00 .bash_logout
      -rw-r--r-- 1 user user 3771 Oct 01 12:00 .bashrc
    </div>
    <div className="text-green-500 mt-2">user@host:~$ <span className="text-white">docker ps</span></div>
    <div className="text-gray-300 whitespace-pre">
      CONTAINER ID   IMAGE          COMMAND                  CREATED       STATUS       PORTS
      a1b2c3d4e5f6   nginx:latest   "/docker-entrypoint.…"   2 hours ago   Up 2 hours   80/tcp
    </div>
    <div className="text-green-500 mt-2">user@host:~$ <span className="animate-pulse">_</span></div>
  </div>
);

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