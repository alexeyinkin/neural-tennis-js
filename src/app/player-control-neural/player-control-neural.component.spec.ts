import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlNeuralComponent } from './player-control-neural.component';

describe('PlayerControlNeuralComponent', () => {
    let component: PlayerControlNeuralComponent;
    let fixture: ComponentFixture<PlayerControlNeuralComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerControlNeuralComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerControlNeuralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
