export class TemaRequest {
  descricao: string;

  precoCamiseta: number;

  precoAcampamento: number;


  constructor(
    descricao: string,
    precoCamisa: number,
    precoAcampamento: number,
  ) {
    this.descricao = descricao;
    this.precoCamiseta = precoCamisa;
    this.precoAcampamento = precoAcampamento;
  }
}
