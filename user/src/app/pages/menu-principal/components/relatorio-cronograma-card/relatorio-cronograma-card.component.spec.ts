import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCronogramaCardComponent } from './relatorio-cronograma-card.component';

describe('RelatorioCronogramaCardComponent', () => {
  let component: RelatorioCronogramaCardComponent;
  let fixture: ComponentFixture<RelatorioCronogramaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioCronogramaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioCronogramaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
