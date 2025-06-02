import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
  HostBinding,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TipoAcampamento } from '../../../../shared/enum/TipoAcampamento';
import { CommonModule } from '@angular/common';
import { compareAsc, isValid, parse } from 'date-fns';
import { NgxMaskDirective } from 'ngx-mask';

export function customDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const dateValue = parse(control.value, 'd/M/yyyy', new Date());

    if (!isValid(dateValue) || dateValue.getFullYear() < 1000) {
      return { invalidDate: 'Formato de data inválido ou data não existe.' };
    }
    return null;
  };
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class AcampamentoFormularioComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  // Adicionado OnDestroy
  @Input() acampamentoId: string | null = null;
  @Output() formCancel = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  formulario: FormGroup;
  tipos = Object.values(TipoAcampamento);
  isEditMode = false;

  @HostBinding('class.container-pequeno') containerPequeno = false;
  @HostBinding('class.container-padrao') containerPadrao = true;

  private fb = inject(FormBuilder);
  private elementRef = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    this.formulario = this.fb.group(
      {
        dataInicio: ['', [Validators.required, customDateValidator()]],
        dataFim: ['', [Validators.required, customDateValidator()]],
        limiteCampistas: ['', [Validators.required, Validators.min(1)]],
        limiteEquipe: ['', [Validators.required, Validators.min(1)]],
        descricao: ['', Validators.required],
        precoCamisa: [0, [Validators.required, Validators.min(0)]],
        precoInscricao: [0, [Validators.required, Validators.min(0)]],
        tipo: ['', Validators.required],
      },
      {
        validators: this.validarDataFimMaior(),
      }
    );
  }

  ngAfterViewInit(): void {
    const elementoObservado = this.elementRef.nativeElement.parentElement;

    if (elementoObservado) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width } = entry.contentRect;
          this.atualizarClassesDeContainer(width);
        }
      });
      this.resizeObserver.observe(elementoObservado);
      Promise.resolve().then(() =>
        this.atualizarClassesDeContainer(elementoObservado.clientWidth)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private atualizarClassesDeContainer(width: number): void {
    const ehPequeno = width < 600;

    if (this.containerPequeno !== ehPequeno) {
      this.containerPequeno = ehPequeno;
      this.containerPadrao = !ehPequeno;
      console.log(
        `Largura do Pai: ${width}px -> Pequeno: ${this.containerPequeno}, Padrão: ${this.containerPadrao}`
      );
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['acampamentoId']) {
      this.isEditMode = !!this.acampamentoId;
      if (this.isEditMode) {
        console.log('Modo Edição (Input Mudou) - ID:', this.acampamentoId);
        // TODO: Carregar os dados e preencher o formulário
      } else {
        console.log('Modo Criação (Input Mudou)');
        this.formulario.reset({
          /* valores padrão */
        });
      }
    }
  }

  get f() {
    return this.formulario.controls;
  }

  private validarDataFimMaior(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const dataInicioControl = group.get('dataInicio');
      const dataFimControl = group.get('dataFim');

      if (!dataInicioControl || !dataFimControl) {
        return null;
      }

      const inicioStr = dataInicioControl.value;
      const fimStr = dataFimControl.value;

      if (
        !inicioStr ||
        !fimStr ||
        dataInicioControl.invalid ||
        dataFimControl.invalid
      ) {
        return null;
      }

      const dataInicio = parse(inicioStr, 'd/M/yyyy', new Date());
      const dataFim = parse(fimStr, 'd/M/yyyy', new Date());

      if (!isValid(dataInicio) || !isValid(dataFim)) {
        return {
          parseErrorIntervalo:
            'Erro ao interpretar datas para comparação de intervalo.',
        };
      }

      if (compareAsc(dataFim, dataInicio) <= 0) {
        return { dataInvalida: 'Data fim deve ser posterior à data início' };
      }

      return null;
    };
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.formSubmit.emit({
      id: this.acampamentoId,
      data: this.formulario.value,
    });
  }

  cancelar(): void {
    console.log('Emitindo Cancelar');
    this.formCancel.emit();
  }
}
