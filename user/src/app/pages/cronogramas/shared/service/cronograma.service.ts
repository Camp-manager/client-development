import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TodosCronogramaDTO } from '../model/cronograma.dto';
import { environment } from '../../../../../../../.enviroment';
import {
  CriarCronogramaCampistasRequest,
  CriarCronogramaTrabalhoRequest,
} from '../model/cronograma.request';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/cronograma`;

  salvarCronogramaTrabalho(
    payload: CriarCronogramaTrabalhoRequest
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/adicionar/trabalho`, payload);
  }

  /**
   * Salva um cronograma para equipes de campistas.
   * POST /cronograma/adicionar/campistas
   */
  salvarCronogramaCampistas(
    payload: CriarCronogramaCampistasRequest
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/adicionar/campistas`, payload);
  }

  // alterarCronograma(request: AlterarCronogramaRequest): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/alterar`, request);
  // }

  buscarTodos(idAcampamento: number): Observable<TodosCronogramaDTO> {
    return this.http.get<TodosCronogramaDTO>(
      `${this.baseUrl}/buscar-todos/${idAcampamento}`
    );
  }

  // estenderCronograma(request: EstenderCronogramaRequest): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/estender`, request);
  // }
}
