import React from 'react';
import { Demand, FLOW_STEPS, STATUS_MAP } from '../types';
import { Badge } from './ui';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  demands: Demand[];
  onDemandClick: (demand: Demand) => void;
}

export function KanbanBoard({ demands, onDemandClick }: KanbanBoardProps) {
  return (
    <div className="flex h-full overflow-x-auto overflow-y-hidden bg-slate-50 p-6 gap-6">
      {FLOW_STEPS.map((step) => {
        const stepDemands = demands.filter(d => d.status === step);
        const { label, color } = STATUS_MAP[step];
        
        return (
          <div key={step} className="flex flex-col w-80 shrink-0">
            <div className={`px-4 py-3 rounded-t-xl border-t-4 shadow-sm bg-white flex items-center justify-between
              ${step === 'recebimento' ? 'border-t-slate-400' : 
                step === 'triagem' ? 'border-t-blue-400' : 
                step === 'direcionamento' ? 'border-t-indigo-400' : 
                step === 'pesquisa' ? 'border-t-purple-400' : 
                step === 'consolidacao' ? 'border-t-fuchsia-400' : 
                step === 'validacao' ? 'border-t-amber-400' : 'border-t-emerald-400'}`}
            >
              <h3 className="font-semibold text-slate-800 text-sm">{label}</h3>
              <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                {stepDemands.length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-100/50 p-3 rounded-b-xl border border-t-0 border-slate-200 space-y-3">
              {stepDemands.map(demand => (
                <DemandCard key={demand.id} demand={demand} onClick={() => onDemandClick(demand)} />
              ))}
              {stepDemands.length === 0 && (
                <div className="text-center p-4 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  Nenhuma demanda
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DemandCard({ demand, onClick }: { demand: Demand, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-slate-500">{demand.id}</span>
        <Badge className={
          demand.priority === 'Alta' ? 'bg-red-50 text-red-700 border-red-200' :
          demand.priority === 'Média' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-emerald-50 text-emerald-700 border-emerald-200'
        } variant="outline">
          {demand.priority}
        </Badge>
      </div>
      
      <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
        {demand.title}
      </h4>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center text-xs text-slate-500 gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(demand.updatedAt), { addSuffix: true, locale: ptBR })}
        </div>
        
        {demand.status === 'validacao' && (
          <div className="flex items-center text-xs text-amber-600 font-medium gap-1 bg-amber-50 px-2 py-1 rounded-md">
            <AlertCircle className="w-3 h-3" />
            Ação Requerida
          </div>
        )}
      </div>
    </div>
  );
}
