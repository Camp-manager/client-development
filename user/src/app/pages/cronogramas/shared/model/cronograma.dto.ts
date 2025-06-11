export interface CronogramaDTO {
  id: number;
  dataInicio: string;
  dataFinal: string;
  descricao: string;
}

export interface CronogramaComEquipeDTO {
  nomeEquipe: string;
  cronogramas: CronogramaDTO[];
}

export interface TodosCronogramaDTO {
  cronogramasEquipeTrabalho: CronogramaComEquipeDTO[];
  cronogramasEquipeCampistas: CronogramaComEquipeDTO[];
}
