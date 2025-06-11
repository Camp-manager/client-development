import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../.enviroment';
import {
  AlterarCronogramaRequest,
  CriarCronogramaRequest,
  EstenderCronogramaRequest,
} from '../model/cronograma.request';
import { TodosCronogramaDTO } from '../model/cronograma.dto';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/cronograma`;

  salvarCronograma(request: CriarCronogramaRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/adicionar`, request);
  }

  alterarCronograma(request: AlterarCronogramaRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/alterar`, request);
  }

  buscarTodos(idAcampamento: number): Observable<TodosCronogramaDTO> {
    return this.http.get<TodosCronogramaDTO>(
      `${this.baseUrl}/buscar-todos/${idAcampamento}`
    );
  }

  estenderCronograma(request: EstenderCronogramaRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/estender`, request);
  }
}
