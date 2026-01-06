import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamAgentComponent } from './parametrage.component';

describe('ParamAgentComponent', () => {
  let component: ParamAgentComponent;
  let fixture: ComponentFixture<ParamAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
