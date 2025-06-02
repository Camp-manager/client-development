import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeDeTrabalhoComponent } from './equipe-de-trabalho.component';

describe('EquipeDeTrabalhoComponent', () => {
  let component: EquipeDeTrabalhoComponent;
  let fixture: ComponentFixture<EquipeDeTrabalhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipeDeTrabalhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipeDeTrabalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
