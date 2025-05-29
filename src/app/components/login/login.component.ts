import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
// CommonModule não é mais necessário para @if, @for etc.
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], // Apenas ReactiveFormsModule é necessário
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  @Output() token = new EventEmitter<void>(); // Emitir void, pois o pai já lê o token

  // Injeção de dependências moderna (opcional)
  private fb = inject(FormBuilder);
  private router = inject(Router);
  // private authService = inject(AuthService); // <-- Injetaria o serviço real

  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  login() {
    // Se o formulário for inválido, marca tudo e sai.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const { email, password } = this.form.value;

    // --- !!! INÍCIO DO MOCK - SUBSTITUIR EM PRODUÇÃO !!! ---
    // Simula uma pequena espera (como uma chamada de API)
    setTimeout(() => {
      // Em um app real, você chamaria:
      // this.authService.login(email!, password!).subscribe({
      //   next: () => {
      //     this.token.emit();
      //     this.isLoading = false;
      //     // Opcional: Redirecionar aqui ou deixar o AppComponent fazer
      //   },
      //   error: (err) => {
      //     this.errorMessage = "E-mail ou senha inválidos."; // Ou outra mensagem de erro
      //     this.isLoading = false;
      //   }
      // });

      // Lógica MOCK atual:
      console.warn('Usando login MOCK. Não use em produção!');
      localStorage.setItem('token', `mock_token_for_${email}`); // Salva um mock token
      this.token.emit(); // Emite o evento para o AppComponent
      this.isLoading = false;
    }, 500); // Atraso de 0.5 segundos
    // --- !!! FIM DO MOCK !!! ---
  }
}
