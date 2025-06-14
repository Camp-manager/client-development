import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// --- FIX: Imports de serviços e modelos corrigidos para seus arquivos individuais ---
import { DialogComponent } from '../../components/dialog/dialog.component';
import { EquipeDTO, MembroEquipe } from './shared/model/equipe.dto';
import { EquipeRequest } from './shared/model/equipe.request';
import { FuncionarioDTO } from './shared/model/funcionario.dto';
import { CampistaDTO } from './shared/model/campista.dto';
import { Acampamento } from '../acampamentos/shared/model/acampamento';

import {
  CampistaService,
  EquipeService,
  FuncionarioService,
} from './shared/service/equipe.service';
import { AcampamentoService } from '../acampamentos/shared/service/acampamento.service';

@Component({
  selector: 'app-equipe-de-trabalho',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogComponent, ReactiveFormsModule],
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
  funcionariosSemTime: FuncionarioDTO[] = [];
  campistasSemTime: CampistaDTO[] = [];
  isLoading = true;

  mostrarDialogoNovasEquipes = false;
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
    funcionarios: FuncionarioDTO[],
    campistas: CampistaDTO[]
  ): void {
    const todosMembrosIds = new Set<number>();
    if (equipes && Array.isArray(equipes)) {
      equipes.forEach((equipe) => {
        // if (equipe && equipe.membros && Array.isArray(equipe.membros)) {
        //   equipe.membros.forEach((membro) => {
        //     if (membro && membro.id) {
        //       todosMembrosIds.add(membro.id);
        //     }
        //   });
        // }
      });
    }

    this.funcionariosSemTime = (funcionarios || []).filter(
      (f) => f && !todosMembrosIds.has(f.id)
    );
    this.campistasSemTime = (campistas || []).filter(
      (c) => c && !todosMembrosIds.has(c.id)
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

  adicionarMembroAEquipe(membro: MembroEquipe, equipeId: number): void {
    this.equipeService
      .adicionarMembros(equipeId, [membro.id])
      .subscribe(() => {});
  }

  removerMembroDaEquipe(
    equipe: EquipeDTO,
    membroParaRemover: MembroEquipe
  ): void {
    this.equipeService
      .removerMembros(equipe.id, [membroParaRemover.id])
      .subscribe(() => {});
  }
}
