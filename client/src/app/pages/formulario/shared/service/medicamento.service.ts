import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CriarCampistaRequest } from '../model/criar-campista.request';
import { CriarFuncionarioRequest } from '../model/criar-funcionario.request';
import { environment } from '../../../../../../../.enviroment';

export interface MedicamentoDTO {
  id: number;
  nome: string;
  quantidade: string;
  tipo: string;
}
@Injectable({
  providedIn: 'root',
})
export class MedicamentoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/medicamento`;

  getTodosMedicamentos(): Observable<MedicamentoDTO[]> {
    return this.http
      .get<MedicamentoDTO[]>(`${this.baseUrl}/buscar-todos`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
