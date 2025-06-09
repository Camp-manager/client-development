export interface CampistaDTO {
  id: number;
  nome: string;
  nomeCompleto: string;
  telefone: string;
  sexo: string;
  peso: number;
  altura: number;
  foiBatizado: 'Sim' | 'Não';
  temPrimeiraComunhao: 'Sim' | 'Não';
  jaFezAcampamento: 'Sim' | 'Não';
  temBarraca: 'Sim' | 'Não';
  temAlergia: 'Sim' | 'Não';
  alergias: string[];
}
