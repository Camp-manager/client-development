import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class CamisetaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.api}/camiseta`;

  getTamanhos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/buscar-tamanhos`);
  }
}
