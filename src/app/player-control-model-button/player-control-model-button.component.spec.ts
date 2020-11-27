import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerControlModelButtonComponent } from './player-control-model-button.component';

describe('PlayerControlPanelModelButtonComponent', () => {
  let component: PlayerControlModelButtonComponent;
  let fixture: ComponentFixture<PlayerControlModelButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerControlModelButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerControlModelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
