import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AllMarkAllotmentComponent } from "./all-mark-allotment.component";

describe("AllMarkAllotmentComponent", () => {
  let component: AllMarkAllotmentComponent;
  let fixture: ComponentFixture<AllMarkAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllMarkAllotmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllMarkAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
