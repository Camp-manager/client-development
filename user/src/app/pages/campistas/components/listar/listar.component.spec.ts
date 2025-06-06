import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampistasListarComponent } from './listar.component';

describe('ListarComponent', () => {
  let component: CampistasListarComponent;
  let fixture: ComponentFixture<CampistasListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampistasListarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CampistasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
