import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-relatorio-camisetas',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './carteirinha.reports.component.html',
})
export class RelatorioCarteirinhaComponent {
  @Input() nomeAcampamento: string = 'Acampamento';
  @Input() equipeDeTrabalho: any | null = null;

  get dataAtual(): Date {
    return new Date();
  }
}
