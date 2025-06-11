import { CriarCronogramaRequest } from '../../../cronogramas/shared/model/cronograma.request';

export interface EquipeRequest {
  nome: string;
  tipoEquipe: string;
  cronogramas: CriarCronogramaRequest[];
}
