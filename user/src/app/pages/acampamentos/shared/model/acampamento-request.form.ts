import { CronogramaRequestForm } from '../../../cronogramas/shared/model/cronograma-request.form';

export class AcampamentoRequest {
  cronogramaRequest: CronogramaRequestForm;

  nomeDoAcampamento: string;

  limiteCampistas: number;

  limiteFuncionario: number;

  idTema: number;

  idTipoAcampamento: number;

  constructor(form: any, idTema: number) {
    this.cronogramaRequest = new CronogramaRequestForm(
      form.dataInicio,
      form.dataFim,
      'Data do Acampamento'
    );
    this.nomeDoAcampamento = form.descricao;
    this.limiteCampistas = form.limiteCampistas;
    this.limiteFuncionario = form.limiteEquipe;
    this.idTipoAcampamento = form.tipo;
    this.idTema = idTema;
  }
}
