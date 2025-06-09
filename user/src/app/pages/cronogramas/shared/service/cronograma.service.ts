import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cronograma } from '../model/cronograma';
import { environment } from '../../../../../.enviroment';
import { CronogramaRequestForm } from '../model/cronograma-request.form';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/cronograma`;

  salvarCronograma(request: CronogramaRequestForm): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/adicionar`, request);
  }

  // alterarCronograma(request: CronogramaRequestForm): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/alterar`, request);
  // }

  getCronogramas(idAcampamento: number): Observable<Cronograma[]> {
    return this.http.get<Cronograma[]>(
      `${this.baseUrl}/buscar-todos/${idAcampamento}`
    );
  }

  estenderCronograma(request: {
    cronogramaId: number;
    novaDataFinal: string;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/estender`, request);
  }
}
