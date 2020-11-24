import { ComponentFixture, TestBed } from '@angular/core/testing';

import PlayerFieldComponent from './player-field.component';

describe('PlayerFieldComponent', () => {
    let component: PlayerFieldComponent;
    let fixture: ComponentFixture<PlayerFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PlayerFieldComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
