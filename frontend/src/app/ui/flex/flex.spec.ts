import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flex } from './flex';

describe('Flex', () => {
  let component: Flex;
  let fixture: ComponentFixture<Flex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
