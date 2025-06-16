import { Component, OnInit, inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AcampamentoService } from './shared/service/acampamento.service';
import { Acampamento } from '../../../../shared/model/acampamento';
import { CronogramaService } from './shared/service/cronograma.service';

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent implements OnInit {
  private acampamentoService = inject(AcampamentoService);
  private cronogramaService = inject(CronogramaService);

  proximoAcampamento: Acampamento | null = null;
  eventosFiltrados: any;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.acampamentoService
      .getProximoAcampamento()
      .pipe(
        switchMap((acampamento) => {
          if (!acampamento) {
            this.error = 'Nenhum próximo acampamento encontrado.';
            return of(null);
          }
          this.proximoAcampamento = acampamento;
          return this.cronogramaService.buscarTodos(acampamento.idAcampamento);
        })
      )
      .subscribe({
        next: (dadosCronograma) => {
          if (dadosCronograma) {
            this.filtrarEventos(dadosCronograma);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar a agenda.';
          this.isLoading = false;
        },
      });
  }

  filtrarEventos(dados: any): void {
    const listaCompleta = [
      ...(dados.cronogramasEquipeTrabalho || []),
      ...(dados.cronogramasEquipeCampistas || []),
    ];

    this.eventosFiltrados = listaCompleta;
  }
}
