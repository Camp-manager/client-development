export interface Endereco {
  id?: number;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  bairro: string;
  pontoReferencia?: string;
}
