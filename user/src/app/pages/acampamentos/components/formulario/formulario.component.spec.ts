import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcampamentoFormularioComponent } from './formulario.component';

describe('FormularioComponent', () => {
  let component: AcampamentoFormularioComponent;
  let fixture: ComponentFixture<AcampamentoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcampamentoFormularioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcampamentoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
