import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAllotComponent } from './mark-allot.component';

describe('MarkAllotComponent', () => {
  let component: MarkAllotComponent;
  let fixture: ComponentFixture<MarkAllotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkAllotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkAllotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
