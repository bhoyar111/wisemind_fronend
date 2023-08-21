import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMarkComponent } from './all-mark.component';

describe('AllMarkComponent', () => {
    let component: AllMarkComponent;
    let fixture: ComponentFixture<AllMarkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ AllMarkComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(AllMarkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
