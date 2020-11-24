import {Component, HostBinding, Input} from '@angular/core';
import Player from '../Player';

@Component({
    selector: 'app-player',
    template: '',
    styleUrls: ['./player.component.scss']
})
export default class PlayerComponent {
    @Input() player!: Player;

    public constructor() { }

    @HostBinding('style.width.px')
    private get width(): number {
        return this.player.getWidth();
    }

    @HostBinding('style.height.px')
    private get height(): number {
        return this.player.getHeight();
    }

    @HostBinding('style.left.px')
    private get x(): number {
        return this.player.getX();
    }

    @HostBinding('style.top.px')
    private get y(): number {
        return this.player.getY();
    }

    @HostBinding('style.backgroundColor')
    private get backgroundColor(): string {
        return this.player.getColor().getRgb();
    }
}
