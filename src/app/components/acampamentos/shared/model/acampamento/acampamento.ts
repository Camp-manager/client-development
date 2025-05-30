import { TipoAcampamento } from '../../../../../shared/enum/TipoAcampamento';

export interface TemaAcampamento {
  descricao: string;
  precoCamisa: number;
  precoInscricao: number;
}

export interface Acampamento {
  id: string;
  code: string; // <--- NOVO CAMPO
  dataInicio: string;
  dataFim: string;
  limiteCampistas: number;
  numeroAtualCampistas: number;
  limiteEquipeTrabalho: number;
  tema: TemaAcampamento;
  tipo: TipoAcampamento;
}

export type Acampamentos = Acampamento[];
