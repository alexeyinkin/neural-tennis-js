import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlCatchModelButtonComponent } from './player-control-catch-model-button.component';

describe('PlayerControlCatchModelButtonComponent', () => {
  let component: PlayerControlCatchModelButtonComponent;
  let fixture: ComponentFixture<PlayerControlCatchModelButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlCatchModelButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlCatchModelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
