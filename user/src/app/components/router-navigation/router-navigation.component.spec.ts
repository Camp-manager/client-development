import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterNavigationComponent } from './router-navigation.component';

describe('RouterNavigationComponent', () => {
  let component: RouterNavigationComponent;
  let fixture: ComponentFixture<RouterNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
