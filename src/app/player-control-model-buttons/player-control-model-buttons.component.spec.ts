import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlModelButtonsComponent } from './player-control-model-buttons.component';

describe('PlayerControlPanelModelButtonsComponent', () => {
  let component: PlayerControlModelButtonsComponent;
  let fixture: ComponentFixture<PlayerControlModelButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlModelButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlModelButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
