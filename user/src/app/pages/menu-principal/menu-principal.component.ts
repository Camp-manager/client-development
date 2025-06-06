import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardConfig } from '../../shared/model/CardConfig';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss',
})
export class MenuPrincipalComponent {
  cards: CardConfig[] = [
    {
      id: 'card1',
      title: 'Opção 1',
      type: 'default',
      columnSpanClass: 'col-1',
      content: 'Conteúdo do card de opção 1.',
      routerLink: '/alguma-rota',
    },
    {
      id: 'card2',
      title: 'Opção 2',
      type: 'default',
      columnSpanClass: 'col-1',
      content: 'Descrição mais detalhada para a opção 2.',
      icon: 'fas fa-star',
    },
    {
      id: 'card4',
      title: 'Outra Opção',
      type: 'default',
      columnSpanClass: 'col-1',
      content: 'Mais uma opção simples.',
    },
    {
      id: 'card5',
      title: 'Justificado',
      type: 'justify',
      columnSpanClass: 'col-1',
      content: 'Item com alinhamento justificado.',
    },
    {
      id: 'cardDestaque',
      title: 'Opção Destaque',
      type: 'mega',
      columnSpanClass: 'full-w',
      content: 'Este card ocupa toda a largura e tem informações importantes.',
      icon: 'fas fa-bullhorn',
    },
    {
      id: 'card7',
      title: 'Opção Três Colunas',
      type: 'default',
      columnSpanClass: 'col-3',
      content: 'Conteúdo que se estende por três colunas.',
    },
    {
      id: 'card8',
      title: 'Final',
      type: 'default',
      columnSpanClass: 'col-1',
      content: 'Último card da lista.',
    },
  ];

  private router = inject(Router);
  navigateTo(link: string | any[]): void {
    if (typeof link === 'string') {
      this.router.navigate([link]);
    } else {
      this.router.navigate(link);
    }
  }

  constructor() {}
}
