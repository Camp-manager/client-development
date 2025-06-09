import { CriarCronogramaRequest } from '../../../cronogramas/shared/model/criar-cronograma.request';

export interface EquipeRequest {
  nome: string;
  tipoEquipe: string;
  cronogramas: CriarCronogramaRequest[];
}
