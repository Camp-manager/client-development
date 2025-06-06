import { AtividadeCronograma } from './atividade-cronograma';
import { EquipeCronograma } from './equipe-cronograma';

export interface Cronograma {
  id: string;
  idAcampamento: string;
  dataInicial: string;
  dataFinal: string;
  descricao: string;
  atividades: AtividadeCronograma[];
  equipes: EquipeCronograma[];
}

export type Cronogramas = Cronograma[];
