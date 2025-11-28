import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import ReleaseView from './views/ReleaseView';
import SSHView from './views/SSHView';
import { useStore } from './store';
import { ViewState } from './types';

const App = () => {
  const currentView = useStore((state) => state.currentView);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView />;
      case ViewState.RELEASE_AUTOMATION:
        return <ReleaseView />;
      case ViewState.SSH_MANAGER:
        return <SSHView />;
      case ViewState.SETTINGS:
        return <div className="p-8 text-white">Settings View (Placeholder)</div>;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative">
        {renderView()}
      </main>
    </div>
  );
};

export default App;