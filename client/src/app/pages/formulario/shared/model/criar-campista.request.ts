import { PessoaRequest } from './pessoa.request';

export interface CriarCampistaRequest {
  usaMedicamento: boolean;
  temAlergia: boolean;
  alergias?: string[];
  jaFezAcampamento: boolean;
  acampamentosFeitos?: string[];
  temBarraca: boolean;
  tamanhoCamisa?: string;
  pessoa: PessoaRequest; // Objeto aninhado com todos os detalhes
}
