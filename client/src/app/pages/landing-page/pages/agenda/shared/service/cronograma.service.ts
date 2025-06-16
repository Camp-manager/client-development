import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../../../.enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/cronograma`;

  buscarTodos(idAcampamento: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/buscar-todos/${idAcampamento}`);
  }
}
