import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CriarCampistaRequest } from '../model/criar-campista.request';
import { CriarFuncionarioRequest } from '../model/criar-funcionario.request';
import { environment } from '../../../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/pessoa`;

  getParentesco(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/buscar-parentesco`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
