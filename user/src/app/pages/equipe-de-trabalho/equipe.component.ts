import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// --- FIX: Imports de serviços e modelos corrigidos para seus arquivos individuais ---
import { DialogComponent } from '../../components/dialog/dialog.component';
import { EquipeDTO } from './shared/model/equipe.dto';
import { EquipeRequest } from './shared/model/equipe.request';
import { Acampamento } from '../acampamentos/shared/model/acampamento';

import {
  CampistaService,
  EquipeService,
  FuncionarioService,
} from './shared/service/equipe.service';
import { AcampamentoService } from '../acampamentos/shared/service/acampamento.service';
import {
  CampistaBasicoDTO,
  FuncionarioBasicoDTO,
} from './shared/model/pessoa.dto';

@Component({
  selector: 'app-equipe-de-trabalho',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.scss'],
})
export class EquipeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private equipeService = inject(EquipeService);
  private campistaService = inject(CampistaService);
  private funcionarioService = inject(FuncionarioService);
  private acampamentoService = inject(AcampamentoService);

  idAcampamento!: number;
  acampamento?: Acampamento;
  equipes: EquipeDTO[] = [];
  funcionariosSemTime: FuncionarioBasicoDTO[] = [];
  campistasSemTime: CampistaBasicoDTO[] = [];
  isLoading = true;

  mostrarDialogoNovasEquipes = false;
  mostrarDialogoAtribuirEquipe = false;
  formNovasEquipes!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormularioEquipes();

    this.route.paramMap.subscribe((params) => {
      if (params.has('idAcampamento')) {
        const id = Number(params.get('idAcampamento'));
        this.carregarDadosDoAcampamento(id);
      } else {
        this.isLoading = true;
        this.acampamentoService.getProximoAcampamento().subscribe({
          next: (proximoAcampamento) => {
            console.log(proximoAcampamento);
            if (proximoAcampamento) {
              this.router.navigate(
                ['/equipe', proximoAcampamento.idAcampamento],
                { replaceUrl: true }
              );
            } else {
              this.isLoading = false;
            }
          },
          error: () => (this.isLoading = false),
        });
      }
    });
  }

  carregarDadosDoAcampamento(id: number): void {
    this.idAcampamento = id;
    this.isLoading = true;
    forkJoin({
      equipes: this.equipeService.getEquipes(id),
      funcionarios: this.funcionarioService.getTodosFuncionarios(id),
      campistas: this.campistaService.getTodosCampistas(id),
    }).subscribe(({ equipes, funcionarios, campistas }) => {
      this.isLoading = false;
      this.processarDados(equipes, funcionarios, campistas);
    });
  }

  processarDados(
    equipes: EquipeDTO[],
    todosOsFuncionarios: FuncionarioBasicoDTO[],
    todosOsCampistas: CampistaBasicoDTO[]
  ): void {
    const idsDePessoasEmEquipes = new Set<string>();

    (equipes || []).forEach((equipe) => {
      (equipe.funcionariosNaEquipe || []).forEach((membro) =>
        idsDePessoasEmEquipes.add(`F-${membro.id}`)
      );

      (equipe.campistasNaEquipe || []).forEach((membro) =>
        idsDePessoasEmEquipes.add(`C-${membro.id}`)
      );
    });

    this.funcionariosSemTime = (todosOsFuncionarios || []).filter(
      (func) => func && !idsDePessoasEmEquipes.has(`F-${func.id}`)
    );

    this.campistasSemTime = (todosOsCampistas || []).filter(
      (campista) => campista && !idsDePessoasEmEquipes.has(`C-${campista.id}`)
    );

    this.equipes = equipes || [];
  }

  inicializarFormularioEquipes(): void {
    this.formNovasEquipes = this.fb.group({
      equipes: this.fb.array([]),
    });
  }

  get equipesArray(): FormArray {
    return this.formNovasEquipes.get('equipes') as FormArray;
  }

  criarFormGroupEquipe(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      tipoEquipe: [null, Validators.required],
    });
  }

  adicionarEquipeAoForm(): void {
    this.equipesArray.push(this.criarFormGroupEquipe());
  }

  removerEquipeDoForm(index: number): void {
    this.equipesArray.removeAt(index);
  }

  abrirDialogoNovasEquipes(): void {
    this.equipesArray.clear();
    this.adicionarEquipeAoForm();
    this.mostrarDialogoNovasEquipes = true;
  }

  fecharDialogoNovasEquipes(): void {
    this.mostrarDialogoNovasEquipes = false;
  }

  salvarNovasEquipes(): void {
    if (this.formNovasEquipes.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const payload: EquipeRequest[] = this.equipesArray.value.map((e: any) => ({
      ...e,
      cronogramas: [],
    }));
    this.equipeService
      .cadastrarEquipes(this.idAcampamento, payload)
      .subscribe(() => {
        alert('Equipes cadastradas com sucesso!');
        this.fecharDialogoNovasEquipes();
        this.carregarDadosDoAcampamento(this.idAcampamento);
      });
  }

  toggleExpand(equipe: EquipeDTO): void {
    equipe.expanded = !equipe.expanded;
  }

  adicionarMembroAEquipe(membro: any, equipeId: number): void {
    this.equipeService.adicionarMembros(equipeId, [membro.id]).subscribe(() => {
      const equipeAlvo = this.equipes.find((e) => e.id === equipeId);
      if (!equipeAlvo) return;

      if ('habilidade' in membro) {
        equipeAlvo.funcionariosNaEquipe = [
          ...equipeAlvo.funcionariosNaEquipe,
          membro,
        ];
      } else {
        equipeAlvo.campistasNaEquipe = [
          ...equipeAlvo.campistasNaEquipe,
          membro,
        ];
      }

      this.carregarDadosDoAcampamento(this.idAcampamento);
    });
  }

  removerMembroDaEquipe(equipe: EquipeDTO, membroParaRemover: any): void {
    this.equipeService
      .removerMembros(equipe.id, [membroParaRemover.id])
      .subscribe(() => {
        if ('habilidade' in membroParaRemover) {
          equipe.funcionariosNaEquipe = equipe.funcionariosNaEquipe.filter(
            (m) => m.id !== membroParaRemover.id
          );
          this.funcionariosSemTime = [
            ...this.funcionariosSemTime,
            membroParaRemover,
          ];
        } else {
          equipe.campistasNaEquipe = equipe.campistasNaEquipe.filter(
            (m) => m.id !== membroParaRemover.id
          );
          this.campistasSemTime = [...this.campistasSemTime, membroParaRemover];
        }
      });
  }

  abrirDialogoAtribuirLider(membro: any): void {
    this.membroSelecionado = membro;
    this.mostrarDialogoAtribuirEquipe = true;
  }

  fecharDialogoAtribuirLider(): void {
    this.mostrarDialogoAtribuirEquipe = false;
  }

  membroSelecionado: FuncionarioBasicoDTO | null = null;
  equipe: number | null = null;

  atribuirLider(membro: FuncionarioBasicoDTO, equipe: number): void {
    this.equipeService
      .selecionarLider(equipe, membro.id, this.idAcampamento)
      .subscribe(() => {
        this.fecharDialogoAtribuirLider();
      });
  }
}
