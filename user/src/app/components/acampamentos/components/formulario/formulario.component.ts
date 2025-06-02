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
  OnDestroy, // Não se esqueça de OnDestroy se estiver usando ResizeObserver
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TipoAcampamento } from '../../../../shared/enum/TipoAcampamento'; // Ajuste o caminho
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  // Adicionado OnDestroy
  @Input() acampamentoId: string | null = null;
  @Output() formCancel = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  formulario: FormGroup;
  tipos = Object.values(TipoAcampamento);
  isEditMode = false;

  // Apenas duas classes de host para o tamanho do container
  @HostBinding('class.container-pequeno') containerPequeno = false;
  @HostBinding('class.container-padrao') containerPadrao = true; // Começa como padrão

  private fb = inject(FormBuilder);
  private elementRef = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    this.formulario = this.fb.group(
      {
        dataInicio: ['', Validators.required],
        dataFim: ['', Validators.required],
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
      // Garante que a detecção de mudanças ocorra após a atualização inicial
      // para pegar as dimensões corretas na primeira vez.
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
    // Define seu breakpoint para "pequeno"
    const ehPequeno = width < 450; // Exemplo de breakpoint, ajuste conforme necessário

    // Atualiza as flags somente se houver mudança, para otimizar a detecção de mudanças
    if (this.containerPequeno !== ehPequeno) {
      this.containerPequeno = ehPequeno;
      this.containerPadrao = !ehPequeno;
      console.log(
        `Largura do Pai: ${width}px -> Pequeno: ${this.containerPequeno}, Padrão: ${this.containerPadrao}`
      );
      this.cdr.detectChanges(); // Força a detecção de mudanças do Angular
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
    // ... (mesma função)
    return (group: AbstractControl): { [key: string]: any } | null => {
      const inicio = group.get('dataInicio')?.value;
      const fim = group.get('dataFim')?.value;
      return inicio && fim && new Date(fim) <= new Date(inicio)
        ? { dataInvalida: 'Data fim deve ser posterior à data início' }
        : null;
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
