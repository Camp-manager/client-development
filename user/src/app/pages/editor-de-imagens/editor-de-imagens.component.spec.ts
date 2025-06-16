import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorDeImagensComponent } from './editor-de-imagens.component';

describe('EditorDeImagensComponent', () => {
  let component: EditorDeImagensComponent;
  let fixture: ComponentFixture<EditorDeImagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorDeImagensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorDeImagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
