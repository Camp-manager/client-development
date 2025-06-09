export interface EnderecoRequest {
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  bairro: string;
  pontoReferencia?: string;
}

export interface FamiliarRequest {
  nome: string;
  parentesco: string;
  telefone: string;
  endereco: EnderecoRequest;
}

export interface PessoaRequest {
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  sexo: string;
  peso: number;
  altura: number;
  alimentoPredileto?: string;
  foiBatizado: boolean;
  temPrimeiraComunhao: boolean;
  endereco: EnderecoRequest;
  familiar: FamiliarRequest;
}
