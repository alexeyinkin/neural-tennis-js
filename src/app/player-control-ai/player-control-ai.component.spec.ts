import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlAiComponent } from './player-control-ai.component';

describe('PlayerControlAiComponent', () => {
    let component: PlayerControlAiComponent;
    let fixture: ComponentFixture<PlayerControlAiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerControlAiComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerControlAiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
