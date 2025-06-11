export interface CriarCronogramaRequest {
  dataInicial: string;
  dataFinal: string;
  descricao: string;
}

export interface AlterarCronogramaRequest extends CriarCronogramaRequest {
  id: number;
}

export interface EstenderCronogramaRequest {
  idCronograma: number;
  diasParaEstender: number;
}
