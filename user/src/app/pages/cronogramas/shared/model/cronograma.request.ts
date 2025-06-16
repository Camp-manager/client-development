import { format } from 'date-fns';

export interface AtividadeRequest {
  tipo: string;
  horario: string;
  descricao: string;
}

export class CronogramaTrabalhoItemRequest {
  dataInicial!: string;
  dataFinal!: string;
  descricao!: string;
  atividades?: AtividadeRequest[];
  constructor(payload: any) {
    if (payload.dataInicial) {
      this.dataInicial = format(payload.dataInicial, 'dd/MM/yyyy');
    }

    if (payload.dataFinal) {
      this.dataFinal = format(payload.dataFinal, 'dd/MM/yyyy');
    }
    this.descricao = payload.descricao;
    this.atividades = payload.atividades;
  }
}

export class CriarCronogramaTrabalhoRequest {
  idDoCampamento: number;
  idsDasEquipes: number[];
  cronogramasParaAEquipe: CronogramaTrabalhoItemRequest[];
  constructor(payload: any) {
    this.idDoCampamento = payload.idAcampamento;
    this.idsDasEquipes = payload.idsEquipes;
    this.cronogramasParaAEquipe = [new CronogramaTrabalhoItemRequest(payload)];
  }
}

export interface EquipeDiaFuncaoRequest {
  data: string;
  funcao: string;
}

export class CriarCronogramaCampistasRequest {
  idDoCampamento: number;
  idsDasEquipes: number[];
  equipesDiaFuncaoRequests: EquipeDiaFuncaoRequest[];
  constructor(payload: any) {
    this.idDoCampamento = payload.idDoCampamento;
    this.idsDasEquipes = [payload.idDoCampamento];
    this.equipesDiaFuncaoRequests = payload.equipesDiaFuncaoRequests;
  }
}
