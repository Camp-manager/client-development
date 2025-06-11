import { Component, Input } from '@angular/core';
import { TodosCronogramaDTO } from '../../pages/cronogramas/shared/model/cronograma.dto';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'cronograma.reports',
  imports: [CommonModule, DatePipe],
  templateUrl: './cronograma.reports.component.html',
  styleUrl: '../styles.scss',
})
export class CronogramaReport {
  @Input() dadosCronograma: TodosCronogramaDTO | null = null;
  @Input() nomeAcampamento: string = 'Acampamento';

  get dataAtual(): Date {
    return new Date();
  }
}
