import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioCronogramaComponent } from './formulario.component';

describe('FormularioCronogramaComponent', () => {
  let component: FormularioCronogramaComponent;
  let fixture: ComponentFixture<FormularioCronogramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCronogramaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioCronogramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
