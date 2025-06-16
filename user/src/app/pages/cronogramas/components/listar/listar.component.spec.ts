import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarCronogramasComponent } from './listar.component';

describe('ListarCronogramasComponent', () => {
  let component: ListarCronogramasComponent;
  let fixture: ComponentFixture<ListarCronogramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCronogramasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarCronogramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
