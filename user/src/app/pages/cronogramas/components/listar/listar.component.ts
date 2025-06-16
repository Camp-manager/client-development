import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TodosCronogramaDTO } from '../../shared/model/cronograma.dto';
import { CronogramaService } from '../../shared/service/cronograma.service';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';

@Component({
  selector: 'app-listar-cronogramas',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarCronogramasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cronogramaService = inject(CronogramaService);
  private acampamentoService = inject(AcampamentoService);

  dadosCronograma: TodosCronogramaDTO | null = null;
  isLoading = true;
  error: string | null = null;
  idAcampamento!: number;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('idAcampamento'));
      if (!id) {
        this.error = 'ID do acampamento não fornecido na URL.';
        this.acampamentoService
          .getProximoAcampamento()
          .subscribe((success) =>
            this.router.navigate([
              '/cronogramas/buscar-todos',
              success.idAcampamento,
            ])
          );
      }
      this.idAcampamento = id;
      this.cronogramaService
        .buscarTodos(this.idAcampamento)
        .subscribe((success) => {
          this.isLoading = false;
          this.dadosCronograma = success;
        });
    });
  }
}
