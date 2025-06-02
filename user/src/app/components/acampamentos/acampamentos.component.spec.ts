import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcampamentosComponent } from './acampamentos.component';

describe('AcampamentosComponent', () => {
  let component: AcampamentosComponent;
  let fixture: ComponentFixture<AcampamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcampamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcampamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
