import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAgentComponent } from './sidebar-agent.component';

describe('SidebarAgentComponent', () => {
  let component: SidebarAgentComponent;
  let fixture: ComponentFixture<SidebarAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
