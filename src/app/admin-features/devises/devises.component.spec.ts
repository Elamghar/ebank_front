import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisesComponent } from './devises.component';

describe('DevisesComponent', () => {
  let component: DevisesComponent;
  let fixture: ComponentFixture<DevisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
