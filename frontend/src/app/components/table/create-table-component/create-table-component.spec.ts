import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTableComponent } from './create-table-component';

describe('CreateTableComponent', () => {
  let component: CreateTableComponent;
  let fixture: ComponentFixture<CreateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
