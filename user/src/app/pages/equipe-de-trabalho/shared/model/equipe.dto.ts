import { CronogramaDTO } from '../../../cronogramas/shared/model/cronograma.dto';
import { CampistaDTO } from './campista.dto';
import { FuncionarioDTO } from './funcionario.dto';

export type MembroEquipe = FuncionarioDTO | CampistaDTO;

export interface EquipeDTO {
  id: number;
  nome: string;
  tipoEquipe: string;
  cronogramas: CronogramaDTO[];
  expanded?: boolean;
}
