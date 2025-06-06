import { Injectable } from '@angular/core';
import { SERVER } from '../../../../../.enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = `${SERVER}/users`;

  constructor(private http: HttpClient) {}

  login(authLoginForm: any): Observable<any> {
    return this.http.post(`${this.API}/login`, authLoginForm);
  }

  register() {
    let register = {
      username: 'Erica Ap. Cristina',
      login: '4guigamers@gmail.com',
      password: '123456',
      roleUser: 'ADMIN',
    };
    this.http.post(`${this.API}/register`, register).subscribe({
      next: (response) => {
        console.log('Usuário registrado com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao registrar usuário:', error);
      },
    });
  }
}
