import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardConfig } from '../../shared/model/CardConfig';
import { DynamicContentDirective } from '../../shared/directives/dynamic-content.directive';
import { RelatorioCronogramaCardComponent } from './components/relatorio-cronograma-card/relatorio-cronograma-card.component';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [CommonModule, RouterModule, DynamicContentDirective],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss',
})
export class MenuPrincipalComponent {
  private router = inject(Router);

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
      id: 'cardRelatorioCronograma',
      title: 'Relatório de Cronograma',
      type: 'default',
      columnSpanClass: 'col-2',
      icon: 'fas fa-calendar-alt',
      component: RelatorioCronogramaCardComponent,
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
      columnSpanClass: 'full-w',
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

  navigateTo(link: string | any[]): void {
    if (typeof link === 'string') {
      this.router.navigate([link]);
    } else {
      this.router.navigate(link);
    }
  }

  handleCardClick(card: CardConfig): void {
    if (card.action) {
      card.action();
    } else if (card.routerLink) {
      this.navigateTo(card.routerLink);
    }
  }

  constructor() {}
}
