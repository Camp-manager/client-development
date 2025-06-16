export interface CronogramaEquipeDTO {
  id: number;
  dataInicio: string;
  dataFinal: string;
  descricao: string;
  equipeId: number;
}

export interface FuncaoEquipeDTO {
  funcao: string;
  data: Date;
}

export interface CronogramaComEquipeDTO {
  nomeEquipe: string;
  cronogramas: CronogramaEquipeDTO[];
  cronogramaDaEquipeCampista: FuncaoEquipeDTO[];
}

export interface TodosCronogramaDTO {
  cronogramasEquipeTrabalho: CronogramaComEquipeDTO[];
  cronogramasEquipeCampistas: CronogramaComEquipeDTO[];
}
