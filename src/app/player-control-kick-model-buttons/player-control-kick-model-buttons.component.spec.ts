import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlKickModelButtonsComponent } from './player-control-kick-model-buttons.component';

describe('PlayerControlKickModelButtonsComponent', () => {
  let component: PlayerControlKickModelButtonsComponent;
  let fixture: ComponentFixture<PlayerControlKickModelButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlKickModelButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlKickModelButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
