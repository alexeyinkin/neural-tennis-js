import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import ControlsComponent from './controls/controls.component';
import FieldComponent from './field/field.component';
import PlayerComponent from './player/player.component';
import BallComponent from './ball/ball.component';
import PlayerControlAiComponent from './player-control-ai/player-control-ai.component';
import PlayerControlComponent from './player-control/player-control.component';
import PlayerControlModelButtonComponent from './player-control-model-button/player-control-model-button.component';
import PlayerControlModelButtonsComponent from './player-control-model-buttons/player-control-model-buttons.component';
import PlayerControlCatchModelButtonComponent from './player-control-catch-model-button/player-control-catch-model-button.component';
import PlayerControlCatchModelButtonsComponent from './player-control-catch-model-buttons/player-control-catch-model-buttons.component';
import PlayerControlKickModelButtonComponent from './player-control-kick-model-button/player-control-kick-model-button.component';
import PlayerControlKickModelButtonsComponent from './player-control-kick-model-buttons/player-control-kick-model-buttons.component';
import PlayerControlManualComponent from './player-control-manual/player-control-manual.component';
import PlayerControlNeuralComponent from './player-control-neural/player-control-neural.component';
import PlayerFieldComponent from './player-field/player-field.component';

@NgModule({
    declarations: [
        AppComponent,
        BallComponent,
        ControlsComponent,
        FieldComponent,
        PlayerComponent,
        PlayerFieldComponent,
        PlayerControlComponent,
        PlayerControlModelButtonComponent,
        PlayerControlModelButtonsComponent,
        PlayerControlAiComponent,
        PlayerControlCatchModelButtonComponent,
        PlayerControlCatchModelButtonsComponent,
        PlayerControlKickModelButtonComponent,
        PlayerControlKickModelButtonsComponent,
        PlayerControlManualComponent,
        PlayerControlNeuralComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
