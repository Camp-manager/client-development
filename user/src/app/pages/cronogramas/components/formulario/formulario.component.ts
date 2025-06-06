import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
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

export function dateRangeValidator(startDateKey: string, endDateKey: string) {
  return (group: AbstractControl): { [key: string]: any } | null => {
    const startDateCtrl = group.get(startDateKey);
    const endDateCtrl = group.get(endDateKey);

    if (startDateCtrl?.value && endDateCtrl?.value) {
      const startDate = parse(startDateCtrl.value, 'yyyy-MM-dd', new Date());
      const endDate = parse(endDateCtrl.value, 'yyyy-MM-dd', new Date());
      if (
        isValidDate(startDate) &&
        isValidDate(endDate) &&
        endDate < startDate
      ) {
        return {
          datasInvalidas:
            'Data final deve ser igual ou posterior à data inicial.',
        };
      }
    }
    return null;
  };
}

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

  // Map to store generated dates for each team to avoid re-computation in template loop
  private diasPorEquipeCache: Map<number, string[]> = new Map();

  constructor() {
    this.cronogramaForm = this.fb.group(
      {
        idAcampamento: ['', Validators.required],
        dataInicial: ['', [Validators.required]], // Simpler date validation for now
        dataFinal: ['', [Validators.required]],
        descricao: ['', Validators.required],
        atividades: this.fb.array([]),
        equipes: this.fb.array([]),
      },
      { validators: dateRangeValidator('dataInicial', 'dataFinal') }
    );
  }

  ngOnInit(): void {
    this.acampamentoService.getAcampamentos().subscribe((data) => {
      this.acampamentosDisponiveis = data;
    });

    // Subscribe to dataInicial and dataFinal changes to update equipe diasDeFuncao
    this.cronogramaForm
      .get('dataInicial')
      ?.valueChanges.subscribe(() => this.atualizarDiasDeFuncaoParaEquipes());
    this.cronogramaForm
      .get('dataFinal')
      ?.valueChanges.subscribe(() => this.atualizarDiasDeFuncaoParaEquipes());
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

  // --- Atividades Management ---
  novaAtividade(): FormGroup {
    return this.fb.group({
      tipo: ['', Validators.required],
      horario: ['', Validators.required], // HH:mm or M/T/N code
      descricao: ['', Validators.required],
    });
  }
  adicionarAtividade(): void {
    this.atividades.push(this.novaAtividade());
  }
  removerAtividade(index: number): void {
    this.atividades.removeAt(index);
  }

  // --- Equipes Management ---
  novaEquipe(): FormGroup {
    const equipeGroup = this.fb.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      diasDeFuncao: this.fb.array([]), // Initialize as empty FormArray
    });
    return equipeGroup;
  }

  adicionarEquipe(): void {
    const equipeGroup = this.novaEquipe();
    this.equipes.push(equipeGroup);
    // After adding, populate its diasDeFuncao based on current cronograma dates
    this.atualizarDiasDeFuncaoParaEquipe(this.equipes.length - 1);
  }
  removerEquipe(index: number): void {
    this.equipes.removeAt(index);
    this.diasPorEquipeCache.delete(index); // Clear cache for removed item
    // Rebuild cache for subsequent items if their indices shift (not strictly necessary here as map keys are original indices)
  }

  // --- EquipeDiaFuncao Management ---
  getDiasDeFuncaoControls(equipeIndex: number): AbstractControl[] {
    const equipeFormGroup = this.equipes.at(equipeIndex) as FormGroup;
    const diasDeFuncaoArray = equipeFormGroup.get('diasDeFuncao') as FormArray;
    return diasDeFuncaoArray.controls;
  }

  getDiasDoCronograma(equipeIndex: number): string[] {
    // Return cached dates if available
    if (this.diasPorEquipeCache.has(equipeIndex)) {
      return this.diasPorEquipeCache.get(equipeIndex)!;
    }

    const dataInicialStr = this.cronogramaForm.get('dataInicial')?.value;
    const dataFinalStr = this.cronogramaForm.get('dataFinal')?.value;
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
    this.diasPorEquipeCache.set(equipeIndex, dias); // Cache the generated dates
    return dias;
  }

  atualizarDiasDeFuncaoParaEquipe(equipeIndex: number): void {
    const equipeFormGroup = this.equipes.at(equipeIndex) as FormGroup;
    const diasDeFuncaoArray = equipeFormGroup.get('diasDeFuncao') as FormArray;
    const diasDoCronograma = this.getDiasDoCronograma(equipeIndex); // This will use/update cache

    // Clear existing controls
    while (diasDeFuncaoArray.length) {
      diasDeFuncaoArray.removeAt(0);
    }

    // Add new controls for each day
    diasDoCronograma.forEach((diaStr) => {
      diasDeFuncaoArray.push(
        this.fb.group({
          data: [diaStr, Validators.required], // Pre-fill the date
          funcao: ['', Validators.required],
        })
      );
    });
  }

  private atualizarDiasDeFuncaoParaEquipes(): void {
    // Clear the entire cache when main dates change
    this.diasPorEquipeCache.clear();
    for (let i = 0; i < this.equipes.length; i++) {
      this.atualizarDiasDeFuncaoParaEquipe(i);
    }
  }

  // --- Form Submission ---
  onSubmit(): void {
    if (this.cronogramaForm.invalid) {
      this.cronogramaForm.markAllAsTouched();
      console.error('Formulário inválido:', this.cronogramaForm.value);
      console.log(
        'Erros no formulário:',
        this.getFormValidationErrors(this.cronogramaForm)
      );
      return;
    }
    this.isSubmitting = true;
    const cronogramaData = this.cronogramaForm.value;
    console.log('Salvando Cronograma:', cronogramaData);

    this.cronogramaService.salvarCronograma(cronogramaData).subscribe({
      next: (savedCronograma) => {
        console.log('Cronograma salvo com sucesso:', savedCronograma);
        this.isSubmitting = false;
        this.router.navigate(['/cronogramas/lista']); // Or some other success route
      },
      error: (err) => {
        console.error('Erro ao salvar cronograma:', err);
        this.isSubmitting = false;
        // Handle error display to user
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/menu-principal']); // Or previous page
  }

  // Helper to log form errors
  private getFormValidationErrors(form: AbstractControl): any[] {
    const errors: any[] = [];
    Object.keys(form.errors || {}).forEach((key) => {
      errors.push({ control: 'form', error: key, value: form.errors![key] });
    });

    Object.keys(form || {}).forEach((key) => {
      const controlErrors = form.get(key)!.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((errorKey) => {
          errors.push({
            control: key,
            error: errorKey,
            value: controlErrors[errorKey],
          });
        });
      }
      if (form.get(key) instanceof FormArray) {
        (form.get(key) as FormArray).controls.forEach((item, index) => {
          if (item instanceof FormGroup) {
            const itemErrors = this.getFormValidationErrors(item);
            if (itemErrors.length > 0) {
              errors.push({
                control: `<span class="math-inline">\{key\}\[</span>{index}]`,
                errors: itemErrors,
              });
            }
          }
        });
      }
    });
    return errors;
  }
}
