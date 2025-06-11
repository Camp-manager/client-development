import { Type } from '@angular/core';

export interface CardConfig {
  id: string;
  title?: string;
  content?: string;
  type: 'default' | 'mega' | 'justify' | string;
  columnSpanClass: string;
  customHeader?: string;
  routerLink?: string | any[];
  icon?: string;
  action?: () => void;

  component?: Type<any>;
}
