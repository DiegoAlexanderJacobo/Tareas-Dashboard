import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementModal } from './requirement-modal';

describe('RequirementModal', () => {
  let component: RequirementModal;
  let fixture: ComponentFixture<RequirementModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RequirementModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
