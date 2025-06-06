export class CronogramaRequest {
  dataInicial: string;

  dataFinal: string;

  descricao: string;

  constructor(dataInicial: string, dataFinal: string, descricao: string) {
    this.dataFinal = dataFinal;
    this.dataInicial = dataInicial;
    this.descricao = descricao;
  }
}
