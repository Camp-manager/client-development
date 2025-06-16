import { CronogramaTrabalhoItemRequest } from '../../../cronogramas/shared/model/cronograma.request';

export class AcampamentoRequest {
  cronogramaRequest: CronogramaTrabalhoItemRequest;

  nomeDoAcampamento: string;

  limiteCampistas: number;

  limiteFuncionario: number;

  idTema: number;

  idTipoAcampamento: number;

  constructor(form: any) {
    this.cronogramaRequest = {
      dataInicial: form.dataInicio,
      dataFinal: form.dataFim,
      descricao: 'Data do Acampamento',
      atividades: [],
    };
    this.nomeDoAcampamento = form.descricao;
    this.limiteCampistas = form.limiteCampistas;
    this.limiteFuncionario = form.limiteEquipe;
    this.idTipoAcampamento = form.tipo;
    this.idTema = form.idTema;
  }
}
