import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../.enviroment';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompradoresCamisetaDTO } from '../model/camiseta.dto';

@Injectable({
  providedIn: 'root',
})
export class CamisetaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/estoque`;

  getDadosRelatorioCamisetas(
    idAcampamento: number
  ): Observable<CompradoresCamisetaDTO> {
    return this.http.get<CompradoresCamisetaDTO>(
      `${this.baseUrl}/compradores-camisa/${idAcampamento}`
    );
  }
}
