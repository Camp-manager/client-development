import { CriarCronogramaCampistasRequest } from './../../shared/model/cronograma.request';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { NgSelectModule } from '@ng-select/ng-select';

import { CronogramaService } from '../../shared/service/cronograma.service';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';
import { EquipeService } from '../../../equipe-de-trabalho/shared/service/equipe.service';
import {
  Acampamentos,
  Acampamento,
} from '../../../acampamentos/shared/model/acampamento';
import { EquipeDTO } from '../../../equipe-de-trabalho/shared/model/equipe.dto';
import { CriarCronogramaTrabalhoRequest } from '../../shared/model/cronograma.request';
import { addDays, format, isValid, parseISO } from 'date-fns';

@Component({
  selector: 'app-formulario-cronograma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioCronogramaComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cronogramaService = inject(CronogramaService);
  private acampamentoService = inject(AcampamentoService);
  private equipeService = inject(EquipeService);
  private subscriptions = new Subscription();

  tipoCronogramaControl = new FormControl('', Validators.required);

  formTrabalho!: FormGroup;
  formCampistas!: FormGroup;

  acampamentosDisponiveis: Acampamentos = [];
  equipesTrabalhoDisponiveis: EquipeDTO[] = [];
  equipesCampistasDisponiveis: EquipeDTO[] = [];
  isSubmitting = false;

  ngOnInit(): void {
    this.acampamentoService
      .getAcampamentos()
      .subscribe((data) => (this.acampamentosDisponiveis = data));
    this.escutarMudancasTipoCronograma();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  escutarMudancasTipoCronograma(): void {
    const sub = this.tipoCronogramaControl.valueChanges.subscribe((tipo) => {
      this.equipesTrabalhoDisponiveis = [];
      this.equipesCampistasDisponiveis = [];
      if (tipo === 'trabalho') {
        this.inicializarFormTrabalho();
      } else if (tipo === 'campistas') {
        this.inicializarFormCampistas();
      }
    });
    this.subscriptions.add(sub);
  }

  inicializarFormTrabalho(): void {
    this.formTrabalho = this.fb.group({
      idDoCampamento: [null, Validators.required],
      idsDasEquipes: [[], Validators.required],
      cronogramasParaAEquipe: this.fb.array([
        this.novoCronogramaTrabalhoItem(),
      ]),
    });
    this.subscriptions.add(
      this.formTrabalho
        .get('idDoCampamento')!
        .valueChanges.subscribe((id) => this.carregarEquipes(id, 'Trabalho'))
    );
  }
  cronogramasTrabalho(form: FormGroup): FormArray {
    return form.get('cronogramasParaAEquipe') as FormArray;
  }
  novoCronogramaTrabalhoItem(): FormGroup {
    return this.fb.group({
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
      descricao: ['', Validators.required],
      atividades: this.fb.array([this.novaAtividade()]),
    });
  }
  atividades(cronogramaItem: AbstractControl): FormArray {
    return cronogramaItem.get('atividades') as FormArray;
  }
  novaAtividade(): FormGroup {
    return this.fb.group({ tipo: 'L', horario: 'M', descricao: '' });
  }
  adicionarCronogramaItem(): void {
    this.cronogramasTrabalho(this.formTrabalho).push(
      this.novoCronogramaTrabalhoItem()
    );
  }
  removerCronogramaItem(index: number): void {
    this.cronogramasTrabalho(this.formTrabalho).removeAt(index);
  }
  adicionarAtividade(cronogramaItem: AbstractControl): void {
    this.atividades(cronogramaItem).push(this.novaAtividade());
  }
  removerAtividade(cronogramaItem: AbstractControl, ativIndex: number): void {
    this.atividades(cronogramaItem).removeAt(ativIndex);
  }

  // --- LÓGICA PARA FORMULÁRIO DE EQUIPE DE CAMPISTAS ---
  inicializarFormCampistas(): void {
    this.formCampistas = this.fb.group({
      idDoCampamento: [null, Validators.required],
      idsDasEquipes: [[], Validators.required],
      equipesDiaFuncaoRequests: this.fb.array([]),
    });

    const sub = this.formCampistas
      .get('idDoCampamento')!
      .valueChanges.subscribe((idAcamp) => {
        this.carregarEquipes(idAcamp, 'Campista');
        this.acampamentoService
          .getAcampamentoBasicoPorId(idAcamp)
          .subscribe((success) => {
            if (success) {
              this.gerarLinhasDeFuncaoDiaria(success);
            }
          });
      });
    this.subscriptions.add(sub);
  }

  funcoesDiarias(form: FormGroup): FormArray {
    return form.get('equipesDiaFuncaoRequests') as FormArray;
  }

  gerarLinhasDeFuncaoDiaria(acampamento: Acampamento): void {
    const funcoesArray = this.funcoesDiarias(this.formCampistas);
    funcoesArray.clear();

    const dataInicio = new Date(acampamento.dataInicio + 'T12:00:00Z');
    const dataFim = new Date(acampamento.dataFim + 'T12:00:00Z');

    if (isValid(dataInicio) && isValid(dataFim)) {
      let diaAtual = dataInicio;
      while (diaAtual <= dataFim) {
        funcoesArray.push(
          this.fb.group({
            data: [
              {
                value: formatDate(diaAtual, 'yyyy-MM-dd', 'en-US'),
                disabled: true,
              },
              Validators.required,
            ],
            funcao: ['', Validators.required],
          })
        );
        diaAtual = addDays(diaAtual, 1);
      }
    }
  }

  carregarEquipes(
    idAcampamento: number,
    tipo: 'Trabalho' | 'Campista' | 'Todos'
  ): void {
    if (idAcampamento) {
      this.equipeService.getEquipes(idAcampamento).subscribe((equipes) => {
        this.equipesTrabalhoDisponiveis = equipes.filter(
          (e) => e.tipoEquipe !== 'Campista'
        );
        this.equipesCampistasDisponiveis = equipes.filter(
          (e) => e.tipoEquipe === 'Campista'
        );
        console.log(this.equipesCampistasDisponiveis);
      });
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    let servico$: Observable<any>;

    if (this.tipoCronogramaControl.value === 'trabalho') {
      if (this.formTrabalho.invalid) {
        this.formTrabalho.markAllAsTouched();
        this.isSubmitting = false;
        return;
      }
      let payload = this.formTrabalho.getRawValue();

      if (
        payload.cronogramasParaAEquipe &&
        Array.isArray(payload.cronogramasParaAEquipe)
      ) {
        payload.cronogramasParaAEquipe.forEach((cronograma: any) => {
          if (cronograma.dataInicial) {
            const dataInicioObj = parseISO(cronograma.dataInicial);
            cronograma.dataInicial = format(dataInicioObj, 'dd/MM/yyyy');
          }
          if (cronograma.dataFinal) {
            const dataFimObj = parseISO(cronograma.dataFinal);
            cronograma.dataFinal = format(dataFimObj, 'dd/MM/yyyy');
          }
        });
      }
      servico$ = this.cronogramaService.salvarCronogramaTrabalho(payload);
    } else if (this.tipoCronogramaControl.value === 'campistas') {
      if (this.formCampistas.invalid) {
        this.formCampistas.markAllAsTouched();
        this.isSubmitting = false;
        return;
      }
      const payload: CriarCronogramaCampistasRequest =
        new CriarCronogramaCampistasRequest(this.formCampistas.getRawValue());

      console.log(payload);
      servico$ = this.cronogramaService.salvarCronogramaCampistas(payload);
    } else {
      this.isSubmitting = false;
      return;
    }

    servico$.subscribe({
      next: () => {
        alert('Cronograma salvo com sucesso!');
        this.router.navigate(['/cronogramas/buscar-todos']);
      },
      error: (err) => {
        alert('Erro ao salvar o cronograma.');
        console.error(err);
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
