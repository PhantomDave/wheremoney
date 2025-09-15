import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridstackWrapperComponent } from './gridstack-wrapper-component';

describe('GridstackWrapperComponent', () => {
  let component: GridstackWrapperComponent;
  let fixture: ComponentFixture<GridstackWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridstackWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridstackWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
