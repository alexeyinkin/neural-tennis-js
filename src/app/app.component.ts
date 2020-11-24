import {Component, HostListener, OnInit} from '@angular/core';
import Engine from './Engine';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export default class AppComponent implements OnInit {
    engine: Engine;

    public constructor() {
        this.engine = new Engine();
    }

    @HostListener('document:keydown', ['$event'])
    private handleKeyDown(event: KeyboardEvent): void {
        this.engine.handleKeyDown(event.code);
    }

    @HostListener('document:keyup', ['$event'])
    private handleKeyUp(event: KeyboardEvent): void {
        this.engine.handleKeyUp(event.code);
    }

    public ngOnInit(): void {
        this.engine.startTicking();
    }
}
