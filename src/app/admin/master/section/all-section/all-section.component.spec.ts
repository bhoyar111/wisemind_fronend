import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSectionComponent } from './all-section.component';

describe('AllSectionComponent', () => {
  let component: AllSectionComponent;
  let fixture: ComponentFixture<AllSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
