export interface ImagemDTO {
  nomeDoArquivo: string;
  pathImagem: string;
  dataDeCriacao: string;
  tamanhoDoArquivo: number;
}

export interface DiretorioDeImagensDTO {
  nomeDoAcampamento: string;
  imagemDeCapa: string;
  imagensDoAcampamento: ImagemDTO[];
}
