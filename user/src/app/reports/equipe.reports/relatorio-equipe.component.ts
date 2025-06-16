import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EquipeDTO } from '../../pages/equipe-de-trabalho/shared/model/equipe.dto';

@Component({
  selector: 'app-relatorio-equipe',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './relatorio-equipe.component.html',
})
export class RelatorioEquipeComponent {
  @Input() nomeAcampamento: string = 'Acampamento';
  @Input() equipe: EquipeDTO | null = null;

  get dataAtual(): Date {
    return new Date();
  }
}
