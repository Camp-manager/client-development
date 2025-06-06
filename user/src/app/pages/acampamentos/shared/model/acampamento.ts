export interface TemaAcampamento {
  descricao: string;
  precoCamisa: number;
  precoInscricao: number;
}

export interface TipoAcampamento {
  id: number;
  descricao: string;
  categoriaDoAcampamento: string;
}

export interface Acampamento {
  idAcampamento: number;
  nomeAcampamento: string;
  dataInicio: string;
  dataFim: string;
  limiteFuncionarios: number;
  limiteCampistas: number;
  tipoAcampamento: TipoAcampamento;
  codigoRegistro: string;
  tema: TemaAcampamento;
}

export type Acampamentos = Acampamento[];
