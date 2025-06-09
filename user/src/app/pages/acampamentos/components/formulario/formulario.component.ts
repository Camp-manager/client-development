import { TemaService } from './../../shared/service/tema.service';
import { TemaAcampamento } from './../../shared/model/acampamento';
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
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { compareAsc, isValid, parse } from 'date-fns';
import { NgxMaskDirective } from 'ngx-mask';
import { AcampamentoService } from '../../shared/service/acampamento.service';
import { TipoService } from '../../shared/service/tipo.service';
import { TipoAcampamento } from '../../shared/model/acampamento';

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
  implements OnChanges, AfterViewInit, OnDestroy, OnInit
{
  @Input() acampamentoId: number | null = null;
  @Output() formCancel = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  formulario: FormGroup;
  tipos: TipoAcampamento[] = [];
  temas: TemaAcampamento[] = [];
  isEditMode = false;

  @HostBinding('class.container-pequeno') containerPequeno = false;
  @HostBinding('class.container-padrao') containerPadrao = true;

  private fb = inject(FormBuilder);
  private service = inject(AcampamentoService);
  private tipoService = inject(TipoService);
  private temaService = inject(TemaService);
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
        tipo: [0, Validators.required],
      },
      {
        validators: this.validarDataFimMaior(),
      }
    );
  }

  ngOnInit(): void {
    this.tipoService
      .buscarTodosTipo()
      .subscribe((success: TipoAcampamento[]) => {
        this.tipos = success;
      });
    this.temaService
      .buscarTodosTemas()
      .subscribe((success: TemaAcampamento[]) => {
        this.temas = success;
      });
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
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['acampamentoId']) {
      this.isEditMode = !!this.acampamentoId;
      if (this.isEditMode) {
        this.service
          .getAcampamentoBasicoPorId(this.acampamentoId!)
          .subscribe((success) => {
            this.formulario.reset({
              dataInicio: [success.dataInicio],
              dataFim: [success.dataFim],
              limiteCampistas: [success.limiteCampistas],
              limiteEquipe: [success.limiteFuncionarios],
              descricao: [success.nomeAcampamento],
              precoCamisa: [success.tema.precoCamisa],
              precoInscricao: [success.tema.precoInscricao],
              tipo: [success.tipoAcampamento.id],
            });
          });
      } else {
        this.formulario.reset();
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
    const payload = { ...this.formulario.value };

    payload.tipo = +payload.tipo;
    const tema: TemaAcampamento = this.temas.filter((tema) => {
      tema.descricao == this.formulario.value.descricao;
    })[0];
    if (!tema) this.service.adicionarAcampamento(payload);
    else {
      payload.idTema = tema.id;
      this.service.adicionarAcampamentoComTemaExistente(payload);
    }
    this.formulario.reset();
  }

  cancelar(): void {
    this.formCancel.emit();
  }
}
