import React, { useState } from 'react';
import { initialDemands } from './data/mock';
import { Demand, DemandStatus } from './types';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { DemandModal } from './components/DemandModal';
import { NewDemandModal } from './components/NewDemandModal';
import { Button } from './components/ui';
import { Scale, LayoutDashboard, KanbanSquare, Plus } from 'lucide-react';

export default function App() {
  const [demands, setDemands] = useState<Demand[]>(initialDemands);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanban'>('kanban');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const handleCreateDemand = (data: { title: string; description: string; requester: string; priority: 'Baixa' | 'Média' | 'Alta' }) => {
    const newDemand: Demand = {
      id: `DEM-${String(demands.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'recebimento',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDemands([newDemand, ...demands]);
    setIsNewModalOpen(false);
  };

  const handleSimulateAI = (demandId: string) => {
    // Simulate the AI multi-agent process
    const processSteps: { status: DemandStatus; delay: number; update: Partial<Demand> }[] = [
      { status: 'triagem', delay: 800, update: { classification: 'Análise Preliminar Concluída' } },
      { status: 'direcionamento', delay: 1600, update: { assignedAgents: ['Agente de Pesquisa', 'Agente de Consolidação'] } },
      { status: 'pesquisa', delay: 2400, update: { foundations: ['Lei 10.406/2002 (Código Civil)', 'Precedentes do Tribunal de Justiça'] } },
      { status: 'consolidacao', delay: 3200, update: { draftResponse: 'Com base na análise preliminar, sugerimos a seguinte abordagem...\n\n[Minuta gerada automaticamente pelos agentes]' } },
      { status: 'validacao', delay: 4000, update: {} },
    ];

    processSteps.forEach(({ status, delay, update }) => {
      setTimeout(() => {
        setDemands(prev => prev.map(d => {
          if (d.id === demandId) {
            const updatedDemand = { ...d, status, updatedAt: new Date().toISOString(), ...update };
            // Update selected demand if it's currently open
            if (selectedDemand?.id === demandId) {
              setSelectedDemand(updatedDemand);
            }
            return updatedDemand;
          }
          return d;
        }));
      }, delay);
    });
  };

  const handleValidate = (demandId: string, finalResponse: string) => {
    setDemands(prev => prev.map(d => {
      if (d.id === demandId) {
        const updatedDemand = {
          ...d,
          status: 'entrega' as DemandStatus,
          finalResponse,
          validatedBy: 'Advogado Logado',
          validatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (selectedDemand?.id === demandId) {
          setSelectedDemand(updatedDemand);
        }
        return updatedDemand;
      }
      return d;
    }));
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Scale className="w-6 h-6 text-blue-500 mr-3" />
          <span className="text-lg font-bold text-white tracking-tight">LegalFlow</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              activeTab === 'kanban' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <KanbanSquare className="w-5 h-5" />
            <span className="font-medium">Fluxo de Demandas</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
              AL
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Advogado Logado</span>
              <span className="text-xs text-slate-500">Validador</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">
            {activeTab === 'dashboard' ? 'Visão Geral' : 'Orquestração de Agentes'}
          </h2>
          <Button onClick={() => setIsNewModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Demanda
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dashboard' ? (
            <Dashboard demands={demands} />
          ) : (
            <KanbanBoard demands={demands} onDemandClick={setSelectedDemand} />
          )}
        </div>
      </main>

      {/* Modals */}
      {selectedDemand && (
        <DemandModal
          demand={selectedDemand}
          onClose={() => setSelectedDemand(null)}
          onSimulateAI={handleSimulateAI}
          onValidate={handleValidate}
        />
      )}

      {isNewModalOpen && (
        <NewDemandModal
          onClose={() => setIsNewModalOpen(false)}
          onSubmit={handleCreateDemand}
        />
      )}
    </div>
  );
}
