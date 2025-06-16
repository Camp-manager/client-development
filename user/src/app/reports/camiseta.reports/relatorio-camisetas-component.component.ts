import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CompradoresCamisetaDTO } from '../shared/model/camiseta.dto';

@Component({
  selector: 'app-relatorio-camisetas',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './relatorio-camisetas.reports.component.html',
})
export class RelatorioCamisetasComponent {
  @Input() nomeAcampamento: string = 'Acampamento';
  @Input() dadosRelatorio: CompradoresCamisetaDTO | null = null;

  get dataAtual(): Date {
    return new Date();
  }
}
