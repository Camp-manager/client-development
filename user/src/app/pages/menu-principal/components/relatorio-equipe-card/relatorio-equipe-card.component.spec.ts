import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioEquipeCardComponent } from './relatorio-equipe-card.component';

describe('RelatorioEquipeCardComponent', () => {
  let component: RelatorioEquipeCardComponent;
  let fixture: ComponentFixture<RelatorioEquipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioEquipeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioEquipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
