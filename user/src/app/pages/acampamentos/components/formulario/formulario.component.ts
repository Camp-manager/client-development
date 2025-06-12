import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NgxMaskDirective } from 'ngx-mask';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

import {
  TemaAcampamento,
  TipoAcampamento,
} from '../../shared/model/acampamento';
import { AcampamentoService } from '../../shared/service/acampamento.service';
import { TipoService } from '../../shared/service/tipo.service';
import { TemaService } from '../../shared/service/tema.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    DialogComponent,
  ],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class AcampamentoFormularioComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private acampamentoService = inject(AcampamentoService);
  private tipoService = inject(TipoService);
  private temaService = inject(TemaService);

  private subscriptions = new Subscription();

  formulario!: FormGroup;
  tipos: TipoAcampamento[] = [];
  temas: TemaAcampamento[] = [];
  isEditMode = false;

  mostrarDialogoNovoTema = false;
  formNovoTema!: FormGroup;

  constructor() {
    this.buildForms();
  }

  ngOnInit(): void {
    this.carregarDadosDeApoio();
    this.verificarModoDeEdicao();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  buildForms(): void {
    this.formulario = this.fb.group({
      dataInicio: ['', [Validators.required]],
      dataFim: ['', [Validators.required]],
      limiteCampistas: ['', [Validators.required, Validators.min(1)]],
      limiteEquipe: ['', [Validators.required, Validators.min(1)]],
      idTema: [null, Validators.required],
      tipo: [null, Validators.required],
      precoCamisa: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      precoInscricao: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
    });

    this.formNovoTema = this.fb.group({
      descricao: ['', Validators.required],
      precoAcampamento: [0, [Validators.required, Validators.min(0)]],
      precoCamiseta: [0, [Validators.required, Validators.min(0)]],
    });
  }

  verificarModoDeEdicao(): void {
    const sub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        const acampamentoId = +id;
        this.acampamentoService
          .getAcampamentoBasicoPorId(acampamentoId)
          .subscribe((acamp) => {
            this.formulario.patchValue({
              ...acamp,
              idTema: acamp.tema.id,
              tipo: acamp.tipoAcampamento.id,
              dataInicio: formatDate(acamp.dataInicio, 'yyyy-MM-dd', 'en-US'),
              dataFim: formatDate(acamp.dataFim, 'yyyy-MM-dd', 'en-US'),
            });
          });
      }
    });
    this.subscriptions.add(sub);
  }

  carregarDadosDeApoio(): void {
    const sub = this.tipoService
      .getTiposDeAcampamento()
      .subscribe((tipos) => (this.tipos = tipos));
    this.subscriptions.add(sub);
    this.carregarTemas();
  }

  carregarTemas(): void {
    const subTemas = this.temaService.getTemas().subscribe((temas) => {
      this.temas = temas;
      this.escutarMudancasDeTema();

      if (this.isEditMode) {
        this.atualizarPrecosPeloTema(this.formulario.get('idTema')?.value);
      }
    });
    this.subscriptions.add(subTemas);
  }

  escutarMudancasDeTema(): void {
    const subMudancas = this.formulario
      .get('idTema')
      ?.valueChanges.subscribe((temaId) => {
        this.atualizarPrecosPeloTema(temaId);
      });
    this.subscriptions.add(subMudancas);
  }

  atualizarPrecosPeloTema(temaId: number | null): void {
    if (!temaId) return;

    const temaSelecionado = this.temas.filter((t) => t.id == temaId)[0];
    if (
      temaSelecionado &&
      this.formulario.controls['precoInscricao'].disabled
    ) {
      this.formulario.patchValue(
        {
          precoInscricao: temaSelecionado.precoAcampamento,
          precoCamisa: temaSelecionado.precoCamiseta,
        },
        { emitEvent: false }
      );
    }
  }

  toggleEdicaoPrecos(): void {
    const controls = ['precoInscricao', 'precoCamisa'];
    controls.forEach((controlName) => {
      const control = this.formulario.controls[controlName];
      control.disabled ? control.enable() : control.disable();
    });

    if (this.formulario.controls['precoInscricao'].disabled) {
      const temaId = this.formulario.get('idTema')?.value;
      const temaSelecionado = this.temas.find((t) => t.id === temaId);
      if (temaSelecionado) {
        this.formulario.patchValue({
          precoInscricao: temaSelecionado.precoAcampamento,
          precoCamisa: temaSelecionado.precoCamiseta,
        });
      }
    }
  }

  abrirDialogoNovoTema(): void {
    this.formNovoTema.reset({ precoAcampamento: 0, precoCamiseta: 0 });
    this.mostrarDialogoNovoTema = true;
  }

  fecharDialogoNovoTema(): void {
    this.mostrarDialogoNovoTema = false;
  }

  salvarNovoTema(): void {
    if (this.formNovoTema.invalid) return;
    this.temaService.cadastrarTema(this.formNovoTema.value).subscribe(() => {
      this.carregarTemas();
      this.fecharDialogoNovoTema();
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    console.log(this.formulario.getRawValue());
  }
}
