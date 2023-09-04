import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGameComponent } from './all-game.component';

describe('AllGameComponent', () => {
  let component: AllGameComponent;
  let fixture: ComponentFixture<AllGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
