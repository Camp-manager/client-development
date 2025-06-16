export interface TemaAcampamento {
  id: number;
  descricao: string;
  precoCamiseta: number;
  precoAcampamento: number;
  design: Blob;
}

export interface TipoAcampamento {
  id: number;
  descricao: string;
  categoriaDoAcampamento: string;
}

export interface Acampamento {
  idAcampamento: number;
  nomeAcampamento: string;
  dataInicio: Date;
  dataFim: Date;
  limiteFuncionarios: number;
  limiteCampistas: number;
  tipoAcampamento: TipoAcampamento;
  codigoRegistro: string;
  tema: TemaAcampamento;
}

export type Acampamentos = Acampamento[];
