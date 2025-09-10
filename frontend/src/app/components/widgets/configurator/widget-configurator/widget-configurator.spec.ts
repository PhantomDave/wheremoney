import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetConfigurator } from './widget-configurator';

describe('WidgetConfigurator', () => {
  let component: WidgetConfigurator;
  let fixture: ComponentFixture<WidgetConfigurator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetConfigurator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetConfigurator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
