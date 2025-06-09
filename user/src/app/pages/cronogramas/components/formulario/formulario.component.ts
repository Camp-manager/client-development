import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  addDays,
  differenceInCalendarDays,
  format,
  parse,
  isValid as isValidDate,
} from 'date-fns';

import { CronogramaService } from '../../shared/service/cronograma.service';
import { AcampamentoService } from '../../../acampamentos/shared/service/acampamento.service';
import { Acampamentos } from '../../../acampamentos/shared/model/acampamento';

@Component({
  selector: 'app-formulario-cronograma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioCronogramaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cronogramaService = inject(CronogramaService);
  private acampamentoService = inject(AcampamentoService);

  cronogramaForm!: FormGroup;
  acampamentosDisponiveis: Acampamentos = [];
  isSubmitting = false;

  constructor() {
    this.cronogramaForm = this.fb.group({
      idAcampamento: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
      descricao: ['', Validators.required],
      atividades: this.fb.array([]),
      equipes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.acampamentoService.getAcampamentos().subscribe((data) => {
      this.acampamentosDisponiveis = data;
    });

    this.cronogramaForm
      .get('dataInicial')
      ?.valueChanges.subscribe(() => this.onDateChange());
    this.cronogramaForm
      .get('dataFinal')
      ?.valueChanges.subscribe(() => this.onDateChange());
  }

  get f() {
    return this.cronogramaForm.controls;
  }
  get atividades(): FormArray {
    return this.cronogramaForm.get('atividades') as FormArray;
  }
  get equipes(): FormArray {
    return this.cronogramaForm.get('equipes') as FormArray;
  }

  novaAtividade(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      horario: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }
  adicionarAtividade(): void {
    this.atividades.push(this.novaAtividade());
  }
  removerAtividade(index: number): void {
    this.atividades.removeAt(index);
  }

  novaEquipe(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      diasDeFuncao: this.fb.array([]),
    });
  }
  adicionarEquipe(): void {
    const equipeGroup = this.novaEquipe();
    this.equipes.push(equipeGroup);
    this.atualizarDiasDeFuncaoParaEquipe(equipeGroup);
  }
  removerEquipe(index: number): void {
    this.equipes.removeAt(index);
  }

  getDiasDeFuncaoControls(equipeCtrl: AbstractControl): AbstractControl[] {
    const equipeFormGroup = equipeCtrl as FormGroup;
    return (equipeFormGroup.get('diasDeFuncao') as FormArray).controls;
  }

  private onDateChange(): void {
    if (
      this.f['dataInicial'].valid &&
      this.f['dataFinal'].valid &&
      this.cronogramaForm.valid
    ) {
      this.equipes.controls.forEach((equipe) =>
        this.atualizarDiasDeFuncaoParaEquipe(equipe as FormGroup)
      );
    }
  }

  private atualizarDiasDeFuncaoParaEquipe(equipeFormGroup: FormGroup): void {
    const diasDeFuncaoArray = equipeFormGroup.get('diasDeFuncao') as FormArray;
    const diasDoCronograma = this.getDiasDoCronograma();

    // Mantenha os valores existentes para os dias que ainda existem
    const funcoesExistentes = new Map<string, string>();
    diasDeFuncaoArray.controls.forEach((control) => {
      funcoesExistentes.set(
        control.get('data')?.value,
        control.get('funcao')?.value
      );
    });

    diasDeFuncaoArray.clear();

    diasDoCronograma.forEach((diaStr) => {
      diasDeFuncaoArray.push(
        this.fb.group({
          data: [diaStr, Validators.required],
          funcao: [funcoesExistentes.get(diaStr) || '', Validators.required],
        })
      );
    });
  }

  getDiasDoCronograma(): string[] {
    const dataInicialStr = this.f['dataInicial'].value;
    const dataFinalStr = this.f['dataFinal'].value;
    const dias: string[] = [];

    if (dataInicialStr && dataFinalStr) {
      const dataInicial = parse(dataInicialStr, 'yyyy-MM-dd', new Date());
      const dataFinal = parse(dataFinalStr, 'yyyy-MM-dd', new Date());

      if (
        isValidDate(dataInicial) &&
        isValidDate(dataFinal) &&
        dataFinal >= dataInicial
      ) {
        let currentDate = dataInicial;
        while (currentDate <= dataFinal) {
          dias.push(format(currentDate, 'yyyy-MM-dd'));
          currentDate = addDays(currentDate, 1);
        }
      }
    }
    return dias;
  }

  onSubmit(): void {
    if (this.cronogramaForm.invalid) {
      this.cronogramaForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const cronogramaData = this.cronogramaForm.value;

    this.cronogramaService.salvarCronograma(cronogramaData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/cronogramas', 'lista']); // Supondo que haverá uma lista
      },
      error: (err) => {
        this.isSubmitting = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/menu-principal']);
  }
}
