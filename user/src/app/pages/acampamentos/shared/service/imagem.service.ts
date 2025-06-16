import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class ImagemService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/imagens`;

  uploadZip(
    idAcampamento: number,
    ano: number,
    arquivo: File
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', arquivo, arquivo.name);

    return this.http.post<void>(
      `${this.baseUrl}/inserir-zip/${idAcampamento}/${ano}`,
      formData
    );
  }
}
