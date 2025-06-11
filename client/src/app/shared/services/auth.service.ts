import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = `${environment.API}/users`;

  constructor(private http: HttpClient) {}

  login(authLoginForm: any): Observable<any> {
    return this.http.post(`${this.API}/login`, authLoginForm);
  }
}
