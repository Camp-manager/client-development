import { Component, OnInit, inject } from '@angular/core';
import { MembrosEquipe } from './shared/model/membro-equipe';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AcampamentoService } from '../acampamentos/shared/service/acampamento.service';
import { Acampamento } from '../acampamentos/shared/model/acampamento';
import { CommonModule } from '@angular/common';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

interface EquipeData {
  acampamento: Acampamento | null;
  equipe: MembrosEquipe;
  error?: string | null;
}

@Component({
  selector: 'app-equipe-de-trabalho',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './equipe-de-trabalho.component.html',
  styleUrl: './equipe-de-trabalho.component.scss',
})
export class EquipeDeTrabalhoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private acampamentoService = inject(AcampamentoService);

  acampamento: Acampamento | null = null;
  equipe: MembrosEquipe = [];
  isLoading = true;
  error: string | null = null;
  attemptedDefaultLoad = false;

  private todosOsMembros: MembrosEquipe = [
    {
      id: 'tm1',
      nome: 'Carlos Silva',
      funcao: 'Teatro',
      acampamentoCode: 'ABC12',
      telefone: '11999998888',
      email: 'carlos@email.com',
    },
    {
      id: 'tm2',
      nome: 'Ana Pereira',
      funcao: 'Cozinheira Chefe',
      acampamentoCode: 'ABC12',
      telefone: '11999997777',
      email: 'ana@email.com',
    },
    {
      id: 'tm3',
      nome: 'João Santos',
      funcao: 'Cozinheiro',
      acampamentoCode: 'XYZ78',
      telefone: '11999996666',
      email: 'joao@email.com',
    },
    {
      id: 'tm4',
      nome: 'Maria Oliveira',
      funcao: 'Líder de Círculo',
      acampamentoCode: 'ABC12',
      telefone: '11999995555',
      email: 'maria@email.com',
    },
    {
      id: 'tm5',
      nome: 'Pedro Costa',
      funcao: 'Líder de Círculo',
      acampamentoCode: 'XYZ78',
      telefone: '11999994444',
      email: 'pedro@email.com',
    },
    {
      id: 'tm6',
      nome: 'Juliana Almeida',
      funcao: 'Enfermeira',
      acampamentoCode: 'ABC12',
      email: 'juliana@email.com',
    },
    {
      id: 'tm7',
      nome: 'Lucas Mendes',
      funcao: 'Música',
      acampamentoCode: 'PAST01',
      telefone: '11999993333',
      email: 'lucas@email.com',
    },
    {
      id: 'tm8',
      nome: 'Beatriz Lima',
      funcao: 'Secretaria',
      acampamentoCode: 'PAST01',
      telefone: '11999992222',
      email: 'beatriz@email.com',
    },
  ];

  ngOnInit(): void {
    // this.route.paramMap
    //   .pipe(
    //     tap(() => {
    //       this.isLoading = true;
    //       this.error = null;
    //       this.equipe = [];
    //       this.acampamento = null;
    //       this.attemptedDefaultLoad = false;
    //     }),
    //     switchMap((params) => {
    //       const acampamentoCodeFromRoute = params.get('acampamentoCode');
    //       if (acampamentoCodeFromRoute) {
    //         return this.loadEquipeForCode(acampamentoCodeFromRoute);
    //       } else {
    //         this.attemptedDefaultLoad = true;
    //         return this.acampamentoService.getDefaultAcampamentoCode().pipe(
    //           switchMap((defaultCode) => {
    //             if (defaultCode) {
    //               return this.loadEquipeForCode(defaultCode);
    //             } else {
    //               const errorMsg =
    //                 'Não foi possível determinar um acampamento padrão para a equipe.';
    //               return of({ acampamento: null, equipe: [], error: errorMsg });
    //             }
    //           }),
    //           catchError((err) => {
    //             const errorMsg =
    //               'Erro ao carregar acampamento padrão para a equipe.';
    //             return of({ acampamento: null, equipe: [], error: errorMsg });
    //           })
    //         );
    //       }
    //     })
    //   )
    //   .subscribe((data) => {
    //     this.acampamento = data.acampamento;
    //     // equipe is set within loadEquipeForCode's simulated async
    //     if (data.equipe && data.equipe.length > 0) this.equipe = data.equipe;
    //     if (data.error) this.error = data.error;
    //     // isLoading is set within loadEquipeForCode or error handling
    //   });
  }

  // private loadEquipeForCode(code: string): Observable<EquipeData> {
  //   this.isLoading = true; // Set loading true at the beginning of data fetch
  //   return this.acampamentoService.getAcampamentoByCode(code).pipe(
  //     switchMap((acampDoc) => {
  //       if (acampDoc) {
  //         this.acampamento = acampDoc;
  //         // Simulate fetching team members
  //         // In a real app, this would be an async call returning an Observable
  //         return new Observable<EquipeData>((observer) => {
  //           setTimeout(() => {
  //             this.equipe = this.todosOsMembros.filter(
  //               (membro) => membro.acampamentoCode === code
  //             );
  //             this.isLoading = false;
  //             observer.next({
  //               acampamento: this.acampamento,
  //               equipe: this.equipe,
  //               error: null,
  //             });
  //             observer.complete();
  //           }, 300);
  //         });
  //       } else {
  //         this.isLoading = false;
  //         const errorMsg = `Acampamento com código ${code} não encontrado.`;
  //         return of({ acampamento: null, equipe: [], error: errorMsg });
  //       }
  //     }),
  //     catchError((err) => {
  //       this.isLoading = false;
  //       const errorMsg = `Erro ao carregar dados do acampamento ${code} para a equipe.`;
  //       return of({ acampamento: null, equipe: [], error: errorMsg });
  //     })
  //   );
  // }
}
