import { Medicamento } from './medicamentos';
import { Pessoa } from './pessoa';

export interface Campista {
  id: string;
  pessoa: Pessoa;
  id_acampamento: string;
  usaMedicamento: string;
  medicamentos?: Medicamento[];
  isAlergico: string;
  alergias?: string;
  jaAcampou: string;
  acampamentosJaFeitos?: string;
  temBarraca: string;
}

export type Campistas = Campista[];
