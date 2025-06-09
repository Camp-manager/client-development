import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MembroEquipe } from '../model/membro-equipe';
import { environment } from '../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class EquipeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/equipe`;

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

  // getCampistasByAcampamentoId(idAcampamento: number): Observable<Campistas> {
  //   return this.http.get<Campistas>(
  //     `${this.baseUrl}/buscar/campistas/${idAcampamento}`
  //   );
  // }

  cadastrarCampista(
    codigoRegistro: string,
    campistaRequest: any
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/cadastrar/campista/${codigoRegistro}`,
      campistaRequest
    );
  }

  cadastrarFuncionario(
    codigoRegistro: string,
    funcionarioRequest: any
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/cadastrar/funcionario/${codigoRegistro}`,
      funcionarioRequest
    );
  }

  atribuirCarteirinha(request: {
    idFuncionario: number;
    numeroCarteirinha: string;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/atribur-carteirinha`, request);
  }
}
