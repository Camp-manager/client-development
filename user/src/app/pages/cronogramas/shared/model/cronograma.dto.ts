export interface CronogramaEquipeDTO {
  id: number;
  dataInicio: string;
  dataFinal: string;
  descricao: string;
  equipeId: number;
}

export interface CronogramaComEquipeDTO {
  nomeEquipe: string;
  cronogramas: CronogramaEquipeDTO[];
}

export interface TodosCronogramaDTO {
  cronogramasEquipeTrabalho: CronogramaComEquipeDTO[];
  cronogramasEquipeCampistas: CronogramaComEquipeDTO[];
}
