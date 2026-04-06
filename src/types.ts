export type DemandStatus = 
  | 'recebimento'
  | 'triagem'
  | 'direcionamento'
  | 'pesquisa'
  | 'consolidacao'
  | 'validacao'
  | 'entrega';

export interface Demand {
  id: string;
  title: string;
  description: string;
  requester: string;
  status: DemandStatus;
  createdAt: string;
  updatedAt: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  
  // AI Generated Data
  classification?: string;
  assignedAgents?: string[];
  foundations?: string[];
  draftResponse?: string;
  
  // Human Validation
  finalResponse?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export const STATUS_MAP: Record<DemandStatus, { label: string; color: string }> = {
  recebimento: { label: 'Recebimento', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  triagem: { label: 'Triagem Inicial', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  direcionamento: { label: 'Direcionamento', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  pesquisa: { label: 'Pesquisa', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  consolidacao: { label: 'Consolidação', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  validacao: { label: 'Validação Humana', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  entrega: { label: 'Entrega Final', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export const FLOW_STEPS: DemandStatus[] = [
  'recebimento',
  'triagem',
  'direcionamento',
  'pesquisa',
  'consolidacao',
  'validacao',
  'entrega'
];
