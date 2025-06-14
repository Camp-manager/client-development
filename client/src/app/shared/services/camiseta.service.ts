import { environment } from '../../../../../.enviroment';

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CamisetaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/camiseta`;

  getTamanhos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/buscar-tamanhos`);
  }
}
