import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarkComponent } from './edit-mark.component';

describe('EditMarkComponent', () => {
  let component: EditMarkComponent;
  let fixture: ComponentFixture<EditMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
