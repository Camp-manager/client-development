import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EquipeDeTrabalhoComponent } from './equipe-de-trabalho.component';

describe('PaginaEquipeTrabalhoComponent', () => {
  let component: EquipeDeTrabalhoComponent;
  let fixture: ComponentFixture<EquipeDeTrabalhoComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          if (key === 'acampamentoCode') {
            return 'TESTCODE123';
          }
          return null;
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EquipeDeTrabalhoComponent,
        CommonModule,
        RouterModule.forRoot([]),
      ], // Ensure RouterModule is imported
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipeDeTrabalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load acampamentoCode from route params', () => {
    expect(component.acampamentoCode).toBe('TESTCODE123');
  });
});
