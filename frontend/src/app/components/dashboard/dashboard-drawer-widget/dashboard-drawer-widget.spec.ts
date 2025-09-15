import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDrawerWidget } from './dashboard-drawer-widget';

describe('DashboardDrawerWidget', () => {
  let component: DashboardDrawerWidget;
  let fixture: ComponentFixture<DashboardDrawerWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDrawerWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDrawerWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
