export interface Pessoa {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  telefone: string;
  sexo: string;
  peso: number;
  altura: number;
  alimentoPredileto?: string;
  id_endereco?: string;
  id_familiar?: string;
  batizada?: string;
  primeiraComunhao?: string;
}
