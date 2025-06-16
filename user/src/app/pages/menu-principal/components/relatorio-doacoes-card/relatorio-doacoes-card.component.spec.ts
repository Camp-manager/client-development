import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioDoacoesCardComponent } from './relatorio-doacoes-card.component';

describe('RelatorioDoacoesCardComponent', () => {
  let component: RelatorioDoacoesCardComponent;
  let fixture: ComponentFixture<RelatorioDoacoesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioDoacoesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioDoacoesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
