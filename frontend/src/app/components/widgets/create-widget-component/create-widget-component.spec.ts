import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWidgetComponent } from './create-widget-component';

describe('CreateWidgetComponent', () => {
  let component: CreateWidgetComponent;
  let fixture: ComponentFixture<CreateWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
