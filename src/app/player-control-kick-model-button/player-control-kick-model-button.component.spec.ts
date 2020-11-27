import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlKickModelButtonComponent } from './player-control-kick-model-button.component';

describe('PlayerControlKickModelButtonComponent', () => {
  let component: PlayerControlKickModelButtonComponent;
  let fixture: ComponentFixture<PlayerControlKickModelButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlKickModelButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlKickModelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
