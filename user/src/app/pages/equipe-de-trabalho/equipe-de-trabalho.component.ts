import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { EquipeDTO, MembroEquipe } from './shared/model/equipe.dto';
import {
  CampistaService,
  EquipeService,
  FuncionarioService,
} from './shared/service/equipe.service';
import { FuncionarioDTO } from './shared/model/funcionario.dto';
import { CampistaDTO } from './shared/model/campista.dto';

@Component({
  selector: 'app-equipe-de-trabalho',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './equipe-de-trabalho.component.html',
  styleUrls: ['./equipe-de-trabalho.component.scss'],
})
export class EquipeDeTrabalhoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private equipeService = inject(EquipeService);
  private campistaService = inject(CampistaService);
  private funcionarioService = inject(FuncionarioService);

  idAcampamento!: number;
  equipes: EquipeDTO[] = [];
  funcionariosSemTime: FuncionarioDTO[] = [];
  campistasSemTime: CampistaDTO[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.idAcampamento = Number(params.get('idAcampamento'));
          this.isLoading = true;
          return forkJoin({
            equipes: this.equipeService.getEquipes(this.idAcampamento),
            funcionarios: this.funcionarioService.getTodosFuncionarios(
              this.idAcampamento
            ),
            campistas: this.campistaService.getTodosCampistas(
              this.idAcampamento
            ),
          });
        })
      )
      .subscribe(({ equipes, funcionarios, campistas }) => {
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

  toggleExpand(equipe: EquipeDTO): void {
    equipe.expanded = !equipe.expanded;
  }

  adicionarMembroAEquipe(membro: MembroEquipe, equipeId: number): void {
    this.equipeService.adicionarMembros(equipeId, [membro.id]).subscribe(() => {
      const equipeAlvo = this.equipes.find((e) => e.id === equipeId);
      if (equipeAlvo) {
        equipeAlvo.membros.push(membro);
        this.funcionariosSemTime = this.funcionariosSemTime.filter(
          (f) => f.id !== membro.id
        );
        this.campistasSemTime = this.campistasSemTime.filter(
          (c) => c.id !== membro.id
        );
      }
    });
  }

  removerMembroDaEquipe(equipe: EquipeDTO, membro: MembroEquipe[]): void {
    this.equipeService
      .removerMembros(
        equipe.id,
        membro.map((m) => m.id)
      )
      .subscribe(() => {
        this.ngOnInit();
      });
  }
}
