import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRoleComponent } from './all-role.component';

describe('AllRoleComponent', () => {
  let component: AllRoleComponent;
  let fixture: ComponentFixture<AllRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllRoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
