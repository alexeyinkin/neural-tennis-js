import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import FieldComponent from './field/field.component';
import PlayerComponent from './player/player.component';
import BallComponent from './ball/ball.component';
import PlayerFieldComponent from './player-field/player-field.component';

@NgModule({
    declarations: [
        AppComponent,
        BallComponent,
        FieldComponent,
        PlayerComponent,
        PlayerFieldComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
