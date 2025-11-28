import React from 'react';
import { LayoutDashboard, Rocket, Terminal, Settings, Layers, Box, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { ViewState } from '../types';

const Sidebar = () => {
  const { currentView, setView } = useStore();

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
        currentView === view
          ? 'bg-blue-600 text-white border-r-4 border-blue-400'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Box className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight">DevOps Studio</h1>
          <p className="text-xs text-gray-500">v2.4.0-Pro</p>
        </div>
      </div>

      <div className="flex-1 py-4 space-y-1">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Core</div>
        <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
        <NavItem view={ViewState.RELEASE_AUTOMATION} icon={Rocket} label="Release Pilot" />
        <NavItem view={ViewState.SSH_MANAGER} icon={Terminal} label="SSH Commander" />
        
        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</div>
        <NavItem view={ViewState.SETTINGS} icon={Settings} label="Configuration" />
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <Layers size={20} />
          <span className="font-medium text-sm">Plugins</span>
        </button>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;