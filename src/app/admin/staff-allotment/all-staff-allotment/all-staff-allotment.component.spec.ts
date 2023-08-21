import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStaffAllotmentComponent } from './all-staff-allotment.component';

describe('AllStaffAllotmentComponent', () => {
  let component: AllStaffAllotmentComponent;
  let fixture: ComponentFixture<AllStaffAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllStaffAllotmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllStaffAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
