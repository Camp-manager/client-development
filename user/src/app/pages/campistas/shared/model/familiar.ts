export interface Familiar {
  id: string;
  nome: string;
  parentesco?: string; // Ex: 'Pai', 'Mãe', 'Responsável'
  telefone: string;
  id_endereco?: string;
}
