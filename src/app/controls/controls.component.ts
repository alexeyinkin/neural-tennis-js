import {Component, HostBinding, Input} from '@angular/core';

import Engine from '../Engine';
import FullscreenControllerInterface from '../FullscreenControllerInterface';

@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export default class ControlsComponent {
    @Input() visible!: boolean;
    @Input() engine!: Engine;
    @Input() fullscreenController!: FullscreenControllerInterface;

    @HostBinding('style.display')
    private get display(): string {
        return this.visible ? 'unset' : 'none';
    }

    public handlePauseClick(): void {
        this.engine.toggleTicking();
    }

    public getFullscreenDisplay(): string {
        return document.fullscreenEnabled ? 'unset' : 'none';
    }

    public handleFullScreenClick(): void {
        this.fullscreenController.toggleFullscreen();
    }
}
