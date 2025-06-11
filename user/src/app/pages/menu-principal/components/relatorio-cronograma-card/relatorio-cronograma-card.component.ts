import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';
import { CronogramaService } from '../../../cronogramas/shared/service/cronograma.service';
import { GerarRelatorioService } from '../../../../shared/utils/gerar-relatorio.service';
import { Acampamentos } from '../../../acampamentos/shared/model/acampamento';
import { CronogramaReport } from '../../../../reports/cronograma.reports/cronograma.reports.component';
import { TodosCronogramaDTO } from '../../../cronogramas/shared/model/cronograma.dto';
import { of } from 'rxjs';

@Component({
  selector: 'app-relatorio-cronograma-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-cronograma-card.component.html',
  styleUrls: ['./relatorio-cronograma-card.component.scss'],
})
export class RelatorioCronogramaCardComponent implements OnInit {
  private acampamentoService = inject(AcampamentoService);
  private cronogramaService = inject(CronogramaService);
  private reportService = inject(GerarRelatorioService);

  @ViewChild('pdfContainer', { read: ViewContainerRef })
  pdfContainer!: ViewContainerRef;

  acampamentos: Acampamentos = [];
  idAcampamentoSelecionado: number | null = null;
  isGeneratingReport = false;

  ngOnInit(): void {
    this.acampamentoService.getAcampamentos().subscribe((data) => {
      this.acampamentos = data;
    });
  }

  exportarRelatorioCronograma(): void {
    if (!this.idAcampamentoSelecionado) {
      alert('Por favor, selecione um acampamento.');
      return;
    }

    this.isGeneratingReport = true;

    this.cronogramaService
      .buscarTodos(this.idAcampamentoSelecionado)
      .subscribe({
        next: (dadosCronograma) => {
          const acampamentoSelecionado = this.acampamentos.find(
            (a) => a.idAcampamento === this.idAcampamentoSelecionado
          );
          const nomeAcampamento =
            acampamentoSelecionado?.nomeAcampamento || 'Acampamento';

          this.reportService.generatePdf(
            CronogramaReport,
            this.pdfContainer,
            { dadosCronograma, nomeAcampamento },
            `cronograma-${nomeAcampamento}.pdf`
          );
          this.isGeneratingReport = false;
        },
        error: () => {
          alert('Erro ao buscar os dados do cronograma para este acampamento.');
          this.isGeneratingReport = false;
        },
      });
  }
}
