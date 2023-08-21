import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubjectComponent } from './all-subject.component';

describe('AllSubjectComponent', () => {
  let component: AllSubjectComponent;
  let fixture: ComponentFixture<AllSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
