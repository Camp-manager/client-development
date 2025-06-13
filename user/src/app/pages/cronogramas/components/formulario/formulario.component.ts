import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { addDays, isValid as isValidDate, parseISO } from 'date-fns';

import { NgSelectModule } from '@ng-select/ng-select';

import { CronogramaService } from '../../shared/service/cronograma.service';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';
import { EquipeService } from '../../../equipe-de-trabalho/shared/service/equipe.service';
import {
  Acampamentos,
  Acampamento,
} from '../../../acampamentos/shared/model/acampamento';
import { EquipeDTO } from '../../../equipe-de-trabalho/shared/model/equipe.dto';

@Component({
  selector: 'app-formulario-cronograma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, NgSelectModule],
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
  formAtividades!: FormGroup;
  formFuncoes!: FormGroup;

  acampamentosDisponiveis: Acampamentos = [];
  equipesDisponiveis: EquipeDTO[] = [];
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
      this.equipesDisponiveis = [];
      if (tipo === 'atividades') {
        this.inicializarFormAtividades();
      } else if (tipo === 'funcoes') {
        this.inicializarFormFuncoes();
      }
    });
    this.subscriptions.add(sub);
  }

  inicializarFormAtividades(): void {
    this.formAtividades = this.fb.group({
      idAcampamento: [null, Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
      descricao: ['', Validators.required],
      idsEquipes: [[], Validators.required],
      atividades: this.fb.array([this.novaAtividade()]),
    });
    const sub = this.formAtividades
      .get('idAcampamento')!
      .valueChanges.subscribe((idAcamp) => {
        this.carregarEquipes(idAcamp, 'Trabalho');
      });
    this.subscriptions.add(sub);
  }
  atividades(form: FormGroup): FormArray {
    return form.get('atividades') as FormArray;
  }
  novaAtividade(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      horario: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }
  adicionarAtividade(): void {
    this.atividades(this.formAtividades).push(this.novaAtividade());
  }
  removerAtividade(index: number): void {
    this.atividades(this.formAtividades).removeAt(index);
  }

  // Função centralizada para carregar equipes
  carregarEquipes(idAcampamento: number | null, type: string): void {
    if (idAcampamento) {
      this.equipeService.getEquipes(idAcampamento).subscribe(
        (equipes) =>
          (this.equipesDisponiveis = equipes.filter((e) => {
            return e.tipoEquipe == type;
          }))
      );
    }
  }

  inicializarFormFuncoes(): void {
    this.formFuncoes = this.fb.group({
      idAcampamento: [null, Validators.required],
      funcoesDiarias: this.fb.array([]),
    });

    const subAcampamento = this.formFuncoes
      .get('idAcampamento')!
      .valueChanges.subscribe((idAcamp: any) => {
        const acampamento = this.acampamentosDisponiveis.find(
          (a) => a.idAcampamento === idAcamp
        );
        if (acampamento) {
          this.carregarEquipes(idAcamp, 'Campista');
          this.gerarLinhasDeFuncaoDiaria(acampamento);
        }
      });
    this.subscriptions.add(subAcampamento);
  }
  funcoesDiarias(form: FormGroup): FormArray {
    return form.get('funcoesDiarias') as FormArray;
  }
  gerarLinhasDeFuncaoDiaria(acampamento: Acampamento): void {
    const funcoesArray = this.funcoesDiarias(this.formFuncoes);
    funcoesArray.clear();
    const dataInicio = acampamento.dataInicio;
    const dataFim = acampamento.dataFim;

    if (isValidDate(dataInicio) && isValidDate(dataFim)) {
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
            idEquipe: [null, Validators.required],
            descricaoFuncao: ['', Validators.required],
          })
        );
        diaAtual = addDays(diaAtual, 1);
      }
    }
  }

  get todosOsIdsDeEquipes(): number[] {
    return this.equipesDisponiveis.map((e) => e.id);
  }

  get todosSelecionados(): boolean {
    const idsSelecionados = this.formAtividades?.get('idsEquipes')?.value;
    if (!idsSelecionados || idsSelecionados.length === 0) {
      return false;
    }
    return idsSelecionados.length === this.equipesDisponiveis.length;
  }

  toggleSelecionarTodos(): void {
    const controleEquipes = this.formAtividades?.get('idsEquipes');
    if (!controleEquipes) return;

    if (this.todosSelecionados) {
      controleEquipes.patchValue([]); // Limpa a seleção
    } else {
      controleEquipes.patchValue(this.todosOsIdsDeEquipes); // Seleciona todos
    }
  }

  // --- Lógica de Submissão ---
  onSubmit(): void {
    let formAtual: FormGroup;
    let servico$: Observable<any>;
    let payload: any;

    if (this.tipoCronogramaControl.value === 'atividades') {
      formAtual = this.formAtividades;
      payload = { ...formAtual.getRawValue() };

      // servico$ = this.cronogramaService.salvarCronogramaAtividades(payload);
    } else if (this.tipoCronogramaControl.value === 'funcoes') {
      formAtual = this.formFuncoes;
      payload = { ...formAtual.getRawValue() };

      // servico$ = this.cronogramaService.salvarCronogramaFuncoes(payload);
    } else {
      return;
    }

    if (formAtual.invalid) {
      formAtual.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    // servico$.subscribe({
    //   next: () => {
    //     alert('Cronograma salvo com sucesso!');
    //     this.router.navigate(['/acampamentos/lista']); // Ou outra rota de sucesso
    //   },
    //   error: (err: any) => {
    //     alert('Erro ao salvar o cronograma.');
    //     console.error(err);
    //   },
    //   complete: () => (this.isSubmitting = false),
    // });
  }

  cancelar(): void {
    this.router.navigate(['/acampamentos']);
  }
}
