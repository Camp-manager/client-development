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
import { CamisetaService } from '../../../../reports/shared/service/camiseta.service';
import { GerarRelatorioService } from '../../../../shared/utils/gerar-relatorio.service';
import { Acampamento } from '../../../acampamentos/shared/model/acampamento';
import { RelatorioCamisetasComponent } from '../../../../reports/camiseta.reports/relatorio-camisetas-component.component';

@Component({
  selector: 'app-relatorio-camiseta-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-camiseta-card.component.html',
  styleUrls: ['./relatorio-camiseta-card.component.scss'],
})
export class RelatorioCamisetaCardComponent implements OnInit {
  private acampamentoService = inject(AcampamentoService);
  private camisetaService = inject(CamisetaService);
  private reportService = inject(GerarRelatorioService);

  @ViewChild('pdfContainer', { read: ViewContainerRef })
  pdfContainer!: ViewContainerRef;

  acampamentos: Acampamento[] = [];
  idAcampamentoSelecionado: number | null = null;
  isGeneratingReport = false;

  ngOnInit(): void {
    this.acampamentoService.getAcampamentos().subscribe((data) => {
      this.acampamentos = data;
    });
  }

  exportarRelatorioCamisetas(): void {
    if (!this.idAcampamentoSelecionado) {
      /* ... */ return;
    }

    this.isGeneratingReport = true;

    // Agora chama o novo serviço
    this.camisetaService
      .getDadosRelatorioCamisetas(this.idAcampamentoSelecionado)
      .subscribe({
        next: (dados) => {
          const acampamento = this.acampamentos.find(
            (a) => a.idAcampamento === this.idAcampamentoSelecionado
          );

          // Passa o objeto de dados completo para o gerador de PDF
          this.reportService
            .generatePdf(
              RelatorioCamisetasComponent,
              this.pdfContainer,
              {
                nomeAcampamento: acampamento?.nomeAcampamento,
                dadosRelatorio: dados,
              },
              `relatorio-camisetas-${acampamento?.nomeAcampamento}.pdf`
            )
            .finally(() => (this.isGeneratingReport = false));
        },
        error: () => {
          /* ... */
        },
      });
  }
}
