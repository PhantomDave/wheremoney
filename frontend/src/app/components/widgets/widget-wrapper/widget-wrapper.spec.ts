import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetWrapper } from './widget-wrapper';

describe('WidgetWrapper', () => {
  let component: WidgetWrapper;
  let fixture: ComponentFixture<WidgetWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
