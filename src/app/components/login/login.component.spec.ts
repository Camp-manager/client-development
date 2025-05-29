import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(async () => {
    mockLocalStorage = {}; // Reset mock
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        return mockLocalStorage[key] || null;
      }
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string): void => {
        mockLocalStorage[key] = value;
      }
    );

    await TestBed.configureTestingModule({
      // Importa LoginComponent e os módulos necessários para o teste
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Executa a detecção de mudanças inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when created', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should make the form valid when email and password are correct', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');
    expect(component.form.valid).toBeTruthy();
  });

  it('should mark email as invalid if not a valid email', () => {
    component.form.controls['email'].setValue('not-an-email');
    expect(component.form.controls['email'].valid).toBeFalsy();
  });

  it('should mark password as invalid if less than 6 characters', () => {
    component.form.controls['password'].setValue('123');
    expect(component.form.controls['password'].valid).toBeFalsy();
  });

  it('should have a disabled button when form is invalid', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.login-button');
    expect(button.disabled).toBeTruthy();
  });

  it('should have an enabled button when form is valid', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.login-button');
    expect(button.disabled).toBeFalsy();
  });

  it('should call markAllAsTouched if login is called with invalid form', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.login();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should set localStorage and emit token on successful login', fakeAsync(() => {
    spyOn(component.token, 'emit');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123456');

    component.login();
    tick(500); // Avança o tempo para o setTimeout do mock

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'token',
      'mock_token_for_test@example.com'
    );
    expect(component.token.emit).toHaveBeenCalled();
  }));
});
