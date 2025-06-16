import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Doacao } from '../../pages/menu-principal/components/shared/model/doacao';

@Component({
  selector: 'app-relatorio-doacoes',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './relatorio-doacoes.component.html',
})
export class RelatorioDoacoesComponent {
  @Input() nomeAcampamento: string = 'Acampamento';
  @Input() doacoes: Doacao[] = [];

  get dataAtual(): Date {
    return new Date();
  }
}
