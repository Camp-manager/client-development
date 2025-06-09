export interface TemaAcampamento {
  precoCamiseta: number;
  precoAcampamento: number;
}

export interface TipoAcampamento {
  descricao: string;
}

export interface Acampamento {
  idAcampamento: number;
  nomeAcampamento: string;
  tipoAcampamento: TipoAcampamento;
  tema: TemaAcampamento;
}
