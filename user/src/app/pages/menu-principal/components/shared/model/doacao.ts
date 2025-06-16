export interface Doacao {
  id: number;
  nomeDoador: string;
  itemDoado: string;
  destino: string;
  dataDoacao: string;
  idAcampamento: number;
}

export interface NovaDoacaoRequest {
  nomeDoador: string;
  itemDoado: string;
  destino: string;
  dataDoacao: string;
  idAcampamento: number;
}
