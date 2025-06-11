import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PessoaRequest } from '../model/pessoa.request';
import { CriarCampistaRequest } from '../model/criar-campista.request';
import { CriarFuncionarioRequest } from '../model/criar-funcionario.request';
import { environment } from '../../../../../../../user/src/.enviroment';

@Injectable({
  providedIn: 'root',
})
export class InscricaoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/pessoa`;

  getDadosPessoaPorCPF(cpf: string, idAcampamento: string): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/buscar-pessoa-por-cpf/${cpf}/${idAcampamento}`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  cadastrarCampista(
    codigoRegistro: string,
    payload: CriarCampistaRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/cadastrar/campista/${codigoRegistro}`,
      payload
    );
  }

  cadastrarFuncionario(
    codigoRegistro: string,
    payload: CriarFuncionarioRequest
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/cadastrar/funcionario/${codigoRegistro}`,
      payload
    );
  }
}
