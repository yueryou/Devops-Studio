import { create } from 'zustand';
import { ViewState, ServerNode, PipelineStep } from './types';

interface AppState {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  servers: ServerNode[];
  pipelineSteps: PipelineStep[];
  toggleServerStatus: (id: string) => void;
  addServer: (server: Omit<ServerNode, 'id' | 'status'>) => void;
  runPipeline: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentView: ViewState.DASHBOARD,
  setView: (view) => set({ currentView: view }),
  servers: [
    { id: '1', name: 'Prod-App-01', host: '192.168.1.101', port: 22, username: 'admin', authType: 'password', status: 'connected', tags: ['prod', 'app'] },
    { id: '2', name: 'Prod-DB-01', host: '192.168.1.102', port: 22, username: 'dbadmin', authType: 'privateKey', status: 'disconnected', tags: ['prod', 'db'] },
    { id: '3', name: 'Test-Build-Server', host: '10.0.0.5', port: 2222, username: 'jenkins', authType: 'privateKey', status: 'connected', tags: ['test', 'build'] },
    { id: '4', name: 'Dev-Sandbox', host: '10.0.0.12', port: 22, username: 'dev', authType: 'password', status: 'connected', tags: ['dev'] },
  ],
  pipelineSteps: [
    { id: '1', title: 'Version & Config', status: 'completed', type: 'FILE_OP', log: ['Version set to 1.0.2', 'Config loaded'] },
    { id: '2', title: 'Jenkins Build', status: 'running', type: 'JENKINS', log: ['Triggering job #204...', 'Building modules...', 'Build successful.'] },
    { id: '3', title: 'Package Structure', status: 'pending', type: 'FILE_OP', log: [] },
    { id: '4', title: 'SVN Commit', status: 'pending', type: 'SVN', log: [] },
    { id: '5', title: 'Upload Cloud', status: 'pending', type: 'CLOUD', log: [] },
    { id: '6', title: 'PLM Sync', status: 'pending', type: 'PLM', log: [] },
    { id: '7', title: 'Docs Generation', status: 'pending', type: 'EXCEL', log: [] },
    { id: '8', title: 'Notify Team', status: 'pending', type: 'NOTIFY', log: [] },
  ],
  toggleServerStatus: (id) => set((state) => ({
    servers: state.servers.map(s => s.id === id ? { ...s, status: s.status === 'connected' ? 'disconnected' : 'connected' } : s)
  })),
  addServer: (server) => set((state) => ({
    servers: [...state.servers, { ...server, id: Math.random().toString(36).substr(2, 9), status: 'disconnected' }]
  })),
  runPipeline: () => {
    // Mock pipeline execution
    const steps = get().pipelineSteps;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex >= steps.length) {
        clearInterval(interval);
        return;
      }
      
      set((state) => {
        const newSteps = [...state.pipelineSteps];
        // Complete previous
        if (currentIndex > 0) newSteps[currentIndex - 1].status = 'completed';
        // Start current
        newSteps[currentIndex].status = 'running';
        return { pipelineSteps: newSteps };
      });
      currentIndex++;
    }, 1500);
  }
}));