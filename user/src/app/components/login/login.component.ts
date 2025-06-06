import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
// CommonModule não é mais necessário para @if, @for etc.
import { Router } from '@angular/router';
import { AuthService } from './shared/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], // Apenas ReactiveFormsModule é necessário
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  @Output() token = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(AuthService);

  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.form.get('login');
  }

  get password() {
    return this.form.get('password');
  }

  login() {
    this.isLoading = true;
    this.service.login(this.form.value).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        this.token.emit();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Login falhou. Verifique suas credenciais.';
        console.error('Erro ao fazer login:', error);
      },
      complete: () => {
        this.isLoading;
        false;
      },
    });
  }

  register() {
    this.service.register();
  }
}
