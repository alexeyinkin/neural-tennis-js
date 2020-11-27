import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlManualComponent } from './player-control-manual.component';

describe('PlayerControlManualComponent', () => {
  let component: PlayerControlManualComponent;
  let fixture: ComponentFixture<PlayerControlManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
