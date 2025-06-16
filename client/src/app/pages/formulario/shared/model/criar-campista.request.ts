import { PessoaRequest } from './pessoa.request';

export interface CriarCampistaRequest {
  usaMedicamento: boolean;
  medicamentos?: string[];
  temAlergia: boolean;
  alergias?: string[];
  jaFezAcampamento: boolean;
  acampamentosFeitos?: string[];
  temBarraca: boolean;
  tamanhoCamisa?: string;
  pessoa: PessoaRequest;
}
