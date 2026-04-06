import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Demand, STATUS_MAP } from '../types';
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardProps {
  demands: Demand[];
}

export function Dashboard({ demands }: DashboardProps) {
  const totalDemands = demands.length;
  const pendingValidation = demands.filter(d => d.status === 'validacao').length;
  const completed = demands.filter(d => d.status === 'entrega').length;
  const inProgress = totalDemands - completed;

  const statusData = Object.entries(STATUS_MAP).map(([key, value]) => ({
    name: value.label,
    count: demands.filter(d => d.status === key).length,
    fill: key === 'recebimento' ? '#94a3b8' : 
          key === 'triagem' ? '#60a5fa' : 
          key === 'direcionamento' ? '#818cf8' : 
          key === 'pesquisa' ? '#c084fc' : 
          key === 'consolidacao' ? '#e879f9' : 
          key === 'validacao' ? '#fbbf24' : '#34d399'
  }));

  const priorityData = [
    { name: 'Alta', value: demands.filter(d => d.priority === 'Alta').length, color: '#ef4444' },
    { name: 'Média', value: demands.filter(d => d.priority === 'Média').length, color: '#f59e0b' },
    { name: 'Baixa', value: demands.filter(d => d.priority === 'Baixa').length, color: '#10b981' },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-slate-50">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard de Performance</h1>
        <p className="text-slate-500 mt-2">Visão geral do sistema multiagente LegalFlow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Demandas" value={totalDemands} icon={<FileText className="text-blue-600" />} />
        <StatCard title="Em Andamento" value={inProgress} icon={<Clock className="text-indigo-600" />} />
        <StatCard title="Aguardando Validação" value={pendingValidation} icon={<AlertCircle className="text-amber-600" />} />
        <StatCard title="Concluídas" value={completed} icon={<CheckCircle className="text-emerald-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Demandas por Estágio</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Distribuição por Prioridade</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col gap-2">
              {priorityData.map(p => (
                <div key={p.name} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name} ({p.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className="p-4 bg-slate-50 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
    </div>
  );
}
