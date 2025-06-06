import { EquipeDiaFuncao } from './equipe-dia-funcao';

export interface EquipeCronograma {
  id: string;
  nome: string;
  tipo: string;
  diasDeFuncao?: EquipeDiaFuncao[];
}
