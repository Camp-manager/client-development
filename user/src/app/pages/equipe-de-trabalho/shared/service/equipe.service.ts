import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../.enviroment';
import { CampistaDTO } from '../model/campista.dto';
import { FuncionarioDTO } from '../model/funcionario.dto';
import { EquipeRequest } from '../model/equipe.request';

@Injectable({
  providedIn: 'root',
})
export class EquipeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/equipe`;

  cadastrarEquipes(
    idAcampamento: number,
    equipes: EquipeRequest[]
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/cadastrar/${idAcampamento}`,
      equipes
    );
  }

  getEquipes(idAcampamento: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/buscar-todos/${idAcampamento}`
    );
  }

  adicionarMembros(idEquipe: number, idsPessoas: number[]): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/adicionar-pessoas/${idEquipe}`,
      idsPessoas
    );
  }

  removerMembros(idEquipe: number, idsPessoas: number[]): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/remover-pessoas/${idEquipe}`,
      idsPessoas
    );
  }

  selecionarLider(
    idEquipe: number,
    idPessoa: number,
    idAcampamento: number
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/selecionar-lider/${idEquipe}/${idPessoa}/${idAcampamento}`,
      {}
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class CampistaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/pessoa`;

  getTodosCampistas(idAcampamento: number): Observable<CampistaDTO[]> {
    return this.http.get<CampistaDTO[]>(
      `${this.baseUrl}/buscar-todos/campistas/${idAcampamento}`
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/pessoa`;

  getTodosFuncionarios(idAcampamento: number): Observable<FuncionarioDTO[]> {
    return this.http.get<FuncionarioDTO[]>(
      `${this.baseUrl}/buscar-todos/funcionarios/${idAcampamento}`
    );
  }

  atribuirCarteirinha(request: {
    idFuncionario: number;
    numeroCarteirinha: string;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/atribur-carteirinha`, request);
  }
}
