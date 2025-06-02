export interface RouterHelper {
  nome: string;
  path: string;
  icon?: string;
  children?: RouterHelper[]; // Usa recursivamente a si mesmo
}

export type RouterHelpers = RouterHelper[];
