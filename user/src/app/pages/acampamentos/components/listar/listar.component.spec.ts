import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcampamentoListarComponent } from './listar.component';

describe('ListarComponent', () => {
  let component: AcampamentoListarComponent;
  let fixture: ComponentFixture<AcampamentoListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcampamentoListarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcampamentoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
