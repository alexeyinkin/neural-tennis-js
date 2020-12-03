import {Component, HostListener, OnInit} from '@angular/core';
import Engine from './Engine';
import FullscreenControllerInterface from './FullscreenControllerInterface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export default class AppComponent implements OnInit, FullscreenControllerInterface {
    public engine: Engine;
    public controlsToggled = true;
    private hideControlsTimer: any;

    public constructor() {
        this.engine = new Engine();
        this.engine.setFullscreenController(this);
    }

    @HostListener('document:keydown', ['$event'])
    private handleKeyDown(event: KeyboardEvent): void {
        this.engine.handleKeyDown(event.code);
    }

    @HostListener('document:keyup', ['$event'])
    private handleKeyUp(event: KeyboardEvent): void {
        this.engine.handleKeyUp(event.code);
    }

    public handleFieldClick(): void {
        this.toggleControls();
    }

    private toggleControls(): void {
        clearTimeout(this.hideControlsTimer);
        this.controlsToggled = !this.controlsToggled;

        if (this.controlsToggled) {
            this.setTimeoutToHideControls();
        }
    }

    private setTimeoutToHideControls(): void {
        this.hideControlsTimer = setTimeout(() => this.toggleControls(), 3000);
    }

    public requestFullscreen(): void {
        let docEl = window.document.documentElement;

        // @ts-ignore TODO: Remove prefixed versions when fullscreen works as in the spec.
        let requestFullscreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

        if (requestFullscreen) {
            requestFullscreen.call(docEl);
        }
    }

    public exitFullscreen(): void {
        let doc = document;

        // @ts-ignore TODO: Remove prefixed versions when fullscreen works as in the spec.
        let exitFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (exitFullscreen) {
            exitFullscreen.call(doc);
        }
    }

    public toggleFullscreen(): void {
        if (document.fullscreenElement) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen();
        }
    }

    public ngOnInit(): void {
        this.engine.startTicking();
        this.setTimeoutToHideControls();
    }
}
