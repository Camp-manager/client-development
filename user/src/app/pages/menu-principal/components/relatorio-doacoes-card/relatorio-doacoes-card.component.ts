import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';
import { GerarRelatorioService } from '../../../../shared/utils/gerar-relatorio.service';
import { Acampamentos } from '../../../acampamentos/shared/model/acampamento';
import { DoacaoService } from '../shared/service/doacao.service';
import { RelatorioDoacoesComponent } from '../../../../reports/doacoes.reports/relatorio-doacoes.component';

@Component({
  selector: 'app-relatorio-doacoes-card',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './relatorio-doacoes-card.component.html',
})
export class RelatorioDoacoesCardComponent implements OnInit {
  private acampamentoService = inject(AcampamentoService);
  private doacaoService = inject(DoacaoService);
  private reportService = inject(GerarRelatorioService);

  @ViewChild('pdfContainer', { read: ViewContainerRef, static: true })
  pdfContainer!: ViewContainerRef;

  acampamentos: Acampamentos = [];
  idAcampamentoSelecionado: number | null = null;
  isGeneratingReport = false;

  ngOnInit(): void {
    this.acampamentoService
      .getAcampamentos()
      .subscribe((data) => (this.acampamentos = data));
  }

  exportarRelatorioDoacoes(): void {
    if (!this.idAcampamentoSelecionado) {
      alert('Por favor, selecione um acampamento.');
      return;
    }

    this.isGeneratingReport = true;

    this.doacaoService
      .getDadosRelatorioDoacoes(this.idAcampamentoSelecionado)
      .subscribe({
        next: (doacoes) => {
          const acampamento = this.acampamentos.find(
            (a) => a.idAcampamento === this.idAcampamentoSelecionado
          );

          this.reportService
            .generatePdf(
              RelatorioDoacoesComponent,
              this.pdfContainer,
              {
                nomeAcampamento: acampamento?.nomeAcampamento,
                doacoes: doacoes,
              },
              `relatorio-doacoes-${acampamento?.nomeAcampamento}.pdf`
            )
            .finally(() => (this.isGeneratingReport = false));
        },
        error: () => {
          alert('Erro ao buscar os dados para o relatório de doações.');
          this.isGeneratingReport = false;
        },
      });
  }
}
