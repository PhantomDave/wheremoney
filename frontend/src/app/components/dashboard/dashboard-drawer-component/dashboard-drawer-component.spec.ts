import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDrawerComponent } from './dashboard-drawer-component';

describe('DashboardDrawerComponent', () => {
  let component: DashboardDrawerComponent;
  let fixture: ComponentFixture<DashboardDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
