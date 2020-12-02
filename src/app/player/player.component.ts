import {Component, HostBinding, Input} from '@angular/core';
import PhysicsEnum from '../PhysicsEnum';
import Player from '../Player';

@Component({
    selector: 'app-player',
    template: '',
    styleUrls: ['./player.component.scss'],
})
export default class PlayerComponent {
    @Input() player!: Player;

    public constructor() { }

    @HostBinding('style.width.%')
    private get width(): number {
        return this.player.getWidth();
    }

    @HostBinding('style.height.%')
    private get height(): number {
        return this.player.getHeight() / PhysicsEnum.HEIGHT_RATIO;
    }

    @HostBinding('style.left.%')
    private get x(): number {
        return this.player.getX();
    }

    @HostBinding('style.top.%')
    private get y(): number {
        return this.player.getY() / PhysicsEnum.HEIGHT_RATIO;
    }

    @HostBinding('style.backgroundColor')
    private get backgroundColor(): string {
        return this.player.getColor().getRgb();
    }
}
