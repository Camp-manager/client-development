export interface MembroEquipe {
  id: string;
  nome: string;
  funcao: string;
  telefone?: string;
  email?: string;
  acampamentoCode: string;
}

export type MembrosEquipe = MembroEquipe[];
