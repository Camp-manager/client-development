import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Para testes com Router
import { AppComponent } from './app.component';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let store: { [key: string]: string | null } = {};

  // Mock do localStorage
  const mockLocalStorage = {
    getItem: (key: string): string | null => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };

  beforeEach(async () => {
    store = {}; // Limpa o mock antes de cada teste
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule // Importa o módulo de teste de rotas
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'CampManager' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('CampManager');
  });

  it('should have a null token initially if localStorage is empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges(); // Chama ngOnInit
    expect(app.token).toBeNull();
  });

  it('should set the token when setToken is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    localStorage.setItem('token', 'test-token');
    app.setToken();
    expect(app.token).toEqual('test-token');
  });

  it('should remove the token and navigate on logout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router); // Pega o Router injetado
    const navigateSpy = spyOn(router, 'navigate'); // Espiona o método navigate

    localStorage.setItem('token', 'test-token');
    app.setToken();
    expect(app.token).toEqual('test-token');

    app.logout();

    expect(app.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/']); // Verifica se a navegação ocorreu
  });

  it('should render login component when token is null', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-login')).toBeTruthy();
      expect(compiled.querySelector('.dashboard-container')).toBeFalsy();
  });

   it('should render dashboard when token exists', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      localStorage.setItem('token', 'my-token');
      app.ngOnInit(); // Chama para setar o token
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-login')).toBeFalsy();
      expect(compiled.querySelector('.dashboard-container')).toBeTruthy();
  });
});
