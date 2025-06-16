import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  private readonly VIA_CEP_URL = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  buscarEnderecoPorCep(cep: string): Observable<any> {
    const cleanedCep = cep.replace(/\D/g, '');
    return this.http.get(`${this.VIA_CEP_URL}/${cleanedCep}/json/`);
  }
}
