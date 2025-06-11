import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { TodosCronogramaDTO } from '../../shared/model/cronograma.dto';
import { CronogramaService } from '../../shared/service/cronograma.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-listar-cronogramas',
  imports: [DatePipe],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarCronogramasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cronogramaService = inject(CronogramaService);

  dadosCronograma: TodosCronogramaDTO | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const idAcampamento = Number(params.get('idAcampamento'));
          this.isLoading = true;
          return this.cronogramaService.buscarTodos(idAcampamento);
        })
      )
      .subscribe({
        next: (data) => {
          this.dadosCronograma = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar cronogramas.';
          this.isLoading = false;
        },
      });
  }
}
