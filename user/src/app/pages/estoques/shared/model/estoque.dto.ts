export interface ItemDTO {
  id: number;
  descricao: string;
  quantidade: number;
  tipoItem: string;
  validade: string;
  valor: number;
}

export interface EstoqueDTO {
  id: number;
  localEstoque: string;
  quantidade: number;
  limite: number;
  itens: ItemDTO[];
}

export interface ItemRequest {
  descricao: string;
  quantidade: number;
  tipoItem: string;
  validade: string;
  valor: number;
}

export interface AdicionarItensRequest {
  idEstoque: number;
  itens: ItemRequest[];
}
