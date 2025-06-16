import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatorioCamisetaCardComponent } from './relatorio-camiseta-card.component';

describe('RelatorioCamisetaCardComponent', () => {
  let component: RelatorioCamisetaCardComponent;
  let fixture: ComponentFixture<RelatorioCamisetaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioCamisetaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioCamisetaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
