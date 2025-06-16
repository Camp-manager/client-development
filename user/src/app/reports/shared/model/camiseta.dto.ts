export interface CompradorUltraBasicoDTO {
  id: number;
  nome: string;
  tamanhoCamisetaComprado: string;
}

export interface CompradoresCamisetaDTO {
  totalComVendas: number;
  totalCompradores: number;
  quantidadeCompradoresCampistas: number;
  quantidadeCompradoresFuncionarios: number;
  campistasCompradores: CompradorUltraBasicoDTO[];
  funcionariosCompradores: CompradorUltraBasicoDTO[];
}
