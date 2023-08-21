import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLevelComponent } from './all-level.component';

describe('AllLevelComponent', () => {
  let component: AllLevelComponent;
  let fixture: ComponentFixture<AllLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
