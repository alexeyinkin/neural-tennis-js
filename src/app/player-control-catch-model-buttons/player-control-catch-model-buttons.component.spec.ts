import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlCatchModelButtonsComponent } from './player-control-catch-model-buttons.component';

describe('PlayerControlCatchModelButtonsComponent', () => {
  let component: PlayerControlCatchModelButtonsComponent;
  let fixture: ComponentFixture<PlayerControlCatchModelButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlCatchModelButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlCatchModelButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
