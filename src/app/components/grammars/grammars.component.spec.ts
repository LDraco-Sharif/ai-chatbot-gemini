import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarsComponent } from './grammars.component';

describe('GrammarsComponent', () => {
  let component: GrammarsComponent;
  let fixture: ComponentFixture<GrammarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
