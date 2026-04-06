import React, { useState, useEffect } from 'react';
import { Demand, STATUS_MAP } from '../types';
import { Button, Badge } from './ui';
import { X, Bot, UserCheck, FileText, CheckCircle2, Loader2, Search, Route, Filter } from 'lucide-react';

interface DemandModalProps {
  demand: Demand;
  onClose: () => void;
  onSimulateAI: (demandId: string) => void;
  onValidate: (demandId: string, finalResponse: string) => void;
}

export function DemandModal({ demand, onClose, onSimulateAI, onValidate }: DemandModalProps) {
  const [finalResponse, setFinalResponse] = useState(demand.draftResponse || '');
  const [isSimulating, setIsSimulating] = useState(false);

  // Update local state if demand changes while modal is open
  useEffect(() => {
    setFinalResponse(demand.draftResponse || '');
  }, [demand]);

  const handleSimulate = () => {
    setIsSimulating(true);
    onSimulateAI(demand.id);
    // The parent will handle the actual state updates, we just show a loading state briefly
    setTimeout(() => setIsSimulating(false), 4000); // Fake total simulation time
  };

  const isPendingAI = ['recebimento', 'triagem', 'direcionamento', 'pesquisa', 'consolidacao'].includes(demand.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{demand.id}</span>
            <Badge variant="outline" className={STATUS_MAP[demand.status].color}>
              {STATUS_MAP[demand.status].label}
            </Badge>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{demand.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{demand.description}</p>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Solicitante</span>
                <p className="text-sm text-slate-900 mt-1">{demand.requester}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridade</span>
                <p className="text-sm text-slate-900 mt-1">{demand.priority}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Criado em</span>
                <p className="text-sm text-slate-900 mt-1">{new Date(demand.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {demand.classification && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-blue-500" /> Classificação (IA)
                </h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{demand.classification}</Badge>
              </div>
            )}
          </div>

          {/* Right Column: AI & Validation */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Agents Section */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  Trabalho dos Agentes
                </h3>
                {isPendingAI && (
                  <Button size="sm" onClick={handleSimulate} disabled={isSimulating} className="gap-2">
                    {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    {isSimulating ? 'Processando...' : 'Processar com IA'}
                  </Button>
                )}
              </div>
              
              <div className="p-4 space-y-4">
                {demand.foundations && demand.foundations.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Search className="w-4 h-4 text-purple-500" /> Fundamentos Coletados
                    </h4>
                    <ul className="space-y-2">
                      {demand.foundations.map((f, i) => (
                        <li key={i} className="text-sm text-slate-600 bg-purple-50/50 p-2 rounded border border-purple-100 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic text-center py-4">
                    Os agentes ainda não processaram esta demanda.
                  </p>
                )}

                {demand.draftResponse && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-fuchsia-500" /> Minuta Gerada
                    </h4>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap font-mono">
                      {demand.draftResponse}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Human Validation Section */}
            {(demand.status === 'validacao' || demand.status === 'entrega') && (
              <div className="border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">Validação Humana</h3>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  {demand.status === 'validacao' ? (
                    <>
                      <p className="text-sm text-slate-600">Revise a minuta gerada pela IA e faça os ajustes necessários antes da entrega final.</p>
                      <textarea
                        value={finalResponse}
                        onChange={(e) => setFinalResponse(e.target.value)}
                        className="w-full h-48 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                        placeholder="Edite a resposta final aqui..."
                      />
                      <div className="flex justify-end">
                        <Button onClick={() => onValidate(demand.id, finalResponse)} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Aprovar e Entregar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Aprovado por {demand.validatedBy}</Badge>
                        <span className="text-xs text-slate-500">{new Date(demand.validatedAt!).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap">
                        {demand.finalResponse}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
