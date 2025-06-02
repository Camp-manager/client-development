export interface CardConfig {
  id: string;
  title?: string;
  content?: string;
  type: 'default' | 'mega' | 'justify' | string;
  columnSpanClass: string;
  customHeader?: string;
  embedComponent?: 'formulario' | null;
  routerLink?: string | any[];
  icon?: string;
}
