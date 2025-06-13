export class TemaRequest {
  id?: number;
  descricao: string;

  precoCamiseta: number;

  precoAcampamento: number;

  constructor(
    descricao: string,
    precoCamisa: number,
    precoAcampamento: number,
    id?: number
  ) {
    this.descricao = descricao;
    this.precoCamiseta = precoCamisa;
    this.precoAcampamento = precoAcampamento;
    if (id) this.id = id;
    console.log(this);
  }
}
