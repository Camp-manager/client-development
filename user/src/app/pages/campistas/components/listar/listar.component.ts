import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampistaService } from '../../shared/service/campista.service';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';
import { Acampamento } from '../../../acampamentos/shared/model/acampamento';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { differenceInYears, parse } from 'date-fns';
import { Campistas } from '../../shared/model/campista';

@Component({
  selector: 'app-listar-campistas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class CampistasListarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private campistaService = inject(CampistaService);
  private acampamentoService = inject(AcampamentoService);

  acampamento: Acampamento | null = null;
  campistas: Campistas = [];
  isLoading = true;
  error: string | null = null;
  attemptedDefaultLoad = false;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.error = null;
          this.acampamento = null;
          this.campistas = [];
        }),
        switchMap((params) => {
          const acampamentoId =
            params.get('acampamentoId') == null
              ? 0
              : Number.parseInt(params.get('acampamentoId')!);
          if (acampamentoId == 0) {
            this.isLoading = false;
            this.error = 'Nenhum código de acampamento fornecido na rota.';
            return of(null);
          }
          return this.acampamentoService
            .getAcampamentoBasicoPorId(acampamentoId)
            .pipe(
              switchMap((acamp) => {
                if (!acamp) {
                  this.isLoading = false;
                  this.error = `Acampamento com código "${acampamentoId}" não encontrado.`;
                  return of(null);
                }
                this.acampamento = acamp;
                return this.campistaService.getCampistasByAcampamentoCode(
                  acamp.codigoRegistro
                );
              }),
              catchError((err) => {
                this.isLoading = false;
                this.error = `Erro ao carregar dados: ${err.message}`;
                return of(null);
              })
            );
        })
      )
      .subscribe((campistasResult) => {
        if (campistasResult) {
          this.campistas = campistasResult;
        }
        this.isLoading = false;
      });
  }

  calcularIdade(dataNascimentoStr: string): number | string {
    if (!dataNascimentoStr) return '-';
    try {
      const dataNascimento = parse(dataNascimentoStr, 'yyyy-MM-dd', new Date());
      if (isNaN(dataNascimento.getTime())) return '-';
      return differenceInYears(new Date(), dataNascimento);
    } catch (e) {
      return '-';
    }
  }
}
