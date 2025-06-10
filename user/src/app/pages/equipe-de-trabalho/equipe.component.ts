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
    // FIX: O formulário de equipes agora é inicializado corretamente no início.
    this.inicializarFormularioEquipes();

    this.route.paramMap.subscribe((params) => {
      if (params.has('idAcampamento')) {
        // Cenário 1: O ID está na URL, carrega os dados diretamente.
        const id = Number(params.get('idAcampamento'));
        this.carregarDadosDoAcampamento(id);
      } else {
        this.isLoading = true;
        // this.acampamentoService.get().subscribe({
        //   next: (proximoAcampamento) => {
        //     if (proximoAcampamento) {
        //       // Redireciona para a URL com o ID e deixa o `carregarDadosDoAcampamento` ser chamado novamente pelo subscribe acima.
        //       this.router.navigate(
        //         ['/equipe-de-trabalho', proximoAcampamento.idAcampamento],
        //         { replaceUrl: true }
        //       );
        //     } else {
        //       this.isLoading = false;
        //       // Aqui você pode mostrar uma mensagem de "Nenhum acampamento futuro encontrado".
        //     }
        //   },
        //   error: () => (this.isLoading = false),
        // });
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
      this.processarDados(equipes, funcionarios, campistas);
      this.isLoading = false;
    });
  }

  processarDados(
    equipes: EquipeDTO[],
    funcionarios: FuncionarioDTO[],
    campistas: CampistaDTO[]
  ): void {
    const todosMembrosIds = new Set<number>();
    equipes.forEach((equipe) =>
      equipe.membros.forEach((membro) => todosMembrosIds.add(membro.id))
    );
    this.funcionariosSemTime = funcionarios.filter(
      (f) => !todosMembrosIds.has(f.id)
    );
    this.campistasSemTime = campistas.filter((c) => !todosMembrosIds.has(c.id));
    this.equipes = equipes;
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
    this.equipeService.adicionarMembros(equipeId, [membro.id]).subscribe(() => {
      const equipeAlvo = this.equipes.find((e) => e.id === equipeId);
      if (equipeAlvo) {
        equipeAlvo.membros = [...equipeAlvo.membros, membro];
      }
      this.funcionariosSemTime = this.funcionariosSemTime.filter(
        (f) => f.id !== membro.id
      );
      this.campistasSemTime = this.campistasSemTime.filter(
        (c) => c.id !== membro.id
      );
    });
  }

  // ...

  removerMembroDaEquipe(
    equipe: EquipeDTO,
    membroParaRemover: MembroEquipe
  ): void {
    this.equipeService
      .removerMembros(equipe.id, [membroParaRemover.id])
      .subscribe(() => {
        equipe.membros = equipe.membros.filter(
          (m) => m.id !== membroParaRemover.id
        );

        if ('habilidade' in membroParaRemover) {
          this.funcionariosSemTime = [
            ...this.funcionariosSemTime,
            membroParaRemover as FuncionarioDTO,
          ];
        } else {
          this.campistasSemTime = [
            ...this.campistasSemTime,
            membroParaRemover as CampistaDTO,
          ];
        }
      });
  }
}
