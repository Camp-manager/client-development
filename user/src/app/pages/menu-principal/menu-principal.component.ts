import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardConfig } from '../../shared/model/CardConfig';
import { DynamicContentDirective } from '../../shared/directives/dynamic-content.directive';
import { RelatorioCronogramaCardComponent } from './components/relatorio-cronograma-card/relatorio-cronograma-card.component';
import { RelatorioCamisetaCardComponent } from './components/relatorio-camiseta-card-component/relatorio-camiseta-card.component';
import { RelatorioEquipeCardComponent } from './components/relatorio-equipe-card/relatorio-equipe-card.component';
import { RelatorioDoacoesCardComponent } from './components/relatorio-doacoes-card/relatorio-doacoes-card.component';

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
      title: 'Bem-vindo ao CampManager!',
      type: 'justify',
      columnSpanClass: 'full-w',
      content:
        'Este é o seu painel de gerenciamento. Utilize os cards para navegar pelas funcionalidades, criar acampamentos, gerenciar equipes e gerar relatórios.',
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
      id: 'cardRelatorioCamisetas',
      title: 'Relatório de Camisetas',
      type: 'default',
      columnSpanClass: 'col-2',
      icon: 'fas fa-tshirt',
      component: RelatorioCamisetaCardComponent,
    },
    {
      id: 'cardRelatorioEquipe',
      title: 'Relatório por Equipe',
      icon: 'fas fa-users',
      type: 'default',
      columnSpanClass: 'col-2',
      component: RelatorioEquipeCardComponent,
    },
    {
      id: 'cardRelatorioDoacoes',
      title: 'Relatório de Doações',
      icon: 'fas fa-hand-holding-heart',
      type: 'default',
      columnSpanClass: 'col-2',
      component: RelatorioDoacoesCardComponent,
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
