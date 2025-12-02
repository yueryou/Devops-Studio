
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  RELEASE_AUTOMATION = 'RELEASE_AUTOMATION',
  SSH_MANAGER = 'SSH_MANAGER',
  SETTINGS = 'SETTINGS'
}

export interface ServerNode {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  description?: string;
  authType?: 'password' | 'privateKey';
  status: 'connected' | 'disconnected' | 'error';
  tags: string[];
}

export interface FileItem {
  name: string;
  size: string;
  modified: string;
  type: 'file' | 'dir';
  perms: string;
}

export interface PipelineStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  log: string[];
  type: 'INIT' | 'JENKINS' | 'SVN' | 'FILE_OP' | 'CLOUD' | 'PLM' | 'EXCEL' | 'NOTIFY';
}
