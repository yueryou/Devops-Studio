import React from 'react';
import { Activity, Server, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useStore } from '../store';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Mon', builds: 4, deploys: 2 },
  { name: 'Tue', builds: 7, deploys: 3 },
  { name: 'Wed', builds: 5, deploys: 5 },
  { name: 'Thu', builds: 12, deploys: 8 },
  { name: 'Fri', builds: 9, deploys: 6 },
  { name: 'Sat', builds: 2, deploys: 1 },
  { name: 'Sun', builds: 1, deploys: 0 },
];

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color} size={24} />
      </div>
    </div>
    {subtext && <p className="text-gray-500 text-xs mt-3">{subtext}</p>}
  </div>
);

const DashboardView = () => {
  const { servers, pipelineSteps } = useStore();
  const onlineServers = servers.filter(s => s.status === 'connected').length;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h2>
        <p className="text-gray-400">System overview and active tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Servers" 
          value={`${onlineServers}/${servers.length}`} 
          icon={Server} 
          color="text-green-500" 
          subtext="2 servers require attention" 
        />
        <StatCard 
          title="Pipeline Status" 
          value="Running" 
          icon={Activity} 
          color="text-blue-500" 
          subtext="Step 2/8: Jenkins Build" 
        />
        <StatCard 
          title="Pending Reviews" 
          value="5" 
          icon={FileText} 
          color="text-yellow-500" 
          subtext="PLM Approval Queue" 
        />
        <StatCard 
          title="Avg. Build Time" 
          value="12m 30s" 
          icon={Clock} 
          color="text-purple-500" 
          subtext="-15% from last week" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="builds" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="deploys" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Operations</h3>
          <div className="space-y-4">
            {pipelineSteps.slice(0, 5).map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors">
                {step.status === 'completed' ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : step.status === 'running' ? (
                  <Activity size={18} className="text-blue-500 animate-pulse" />
                ) : step.status === 'failed' ? (
                   <AlertTriangle size={18} className="text-red-500" />
                ) : (
                  <Clock size={18} className="text-gray-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-200">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium">
            View All History
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;