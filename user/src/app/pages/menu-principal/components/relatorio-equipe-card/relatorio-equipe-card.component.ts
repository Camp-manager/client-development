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
import { EquipeService } from '../../../equipe-de-trabalho/shared/service/equipe.service';
import { GerarRelatorioService } from '../../../../shared/utils/gerar-relatorio.service';
import { Acampamentos } from '../../../acampamentos/shared/model/acampamento';
import { EquipeDTO } from '../../../equipe-de-trabalho/shared/model/equipe.dto';
import { RelatorioEquipeComponent } from '../../../../reports/equipe.reports/relatorio-equipe.component';

@Component({
  selector: 'app-relatorio-equipe-card',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './relatorio-equipe-card.component.html',
})
export class RelatorioEquipeCardComponent implements OnInit {
  private acampamentoService = inject(AcampamentoService);
  private equipeService = inject(EquipeService);
  private reportService = inject(GerarRelatorioService);

  @ViewChild('pdfContainer', { read: ViewContainerRef, static: true })
  pdfContainer!: ViewContainerRef;

  acampamentos: Acampamentos = [];
  equipesDoAcampamento: EquipeDTO[] = [];
  idAcampamentoSelecionado: number | null = null;
  equipeSelecionada: EquipeDTO | null = null;
  isGeneratingReport = false;

  ngOnInit(): void {
    this.acampamentoService
      .getAcampamentos()
      .subscribe((data) => (this.acampamentos = data));
  }

  onAcampamentoChange(idAcamp: number): void {
    this.equipeSelecionada = null;
    this.equipesDoAcampamento = [];
    if (idAcamp) {
      this.equipeService
        .getEquipes(idAcamp)
        .subscribe(
          (equipes) =>
            (this.equipesDoAcampamento = equipes.filter(
              (e) => e.tipoEquipe === 'Campista'
            ))
        );
    }
  }

  exportarRelatorioDeEquipe(): void {
    if (!this.equipeSelecionada || !this.idAcampamentoSelecionado) {
      alert('Por favor, selecione um acampamento e uma equipe.');
      return;
    }

    this.isGeneratingReport = true;
    const acampamentoSelecionado = this.acampamentos.find(
      (a) => a.idAcampamento === this.idAcampamentoSelecionado
    );

    this.reportService
      .generatePdf(
        RelatorioEquipeComponent,
        this.pdfContainer,
        {
          nomeAcampamento: acampamentoSelecionado?.nomeAcampamento,
          equipe: this.equipeSelecionada,
        },
        `relatorio-equipe-${this.equipeSelecionada.nome}.pdf`
      )
      .finally(() => (this.isGeneratingReport = false));
  }
}
