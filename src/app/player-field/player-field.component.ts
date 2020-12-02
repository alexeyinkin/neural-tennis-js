import {Component, HostBinding, Input} from '@angular/core';
import Player from "../Player";
import PhysicsEnum from "../PhysicsEnum";

@Component({
    selector: 'app-player-field',
    templateUrl: './player-field.component.html',
    styleUrls: ['./player-field.component.scss'],
})
export default class PlayerFieldComponent {
    backgroundAlpha = .02;
    borderAlpha = .2;
    textAlpha = .12;

    @Input() player!: Player;

    @HostBinding('style.backgroundColor')
    private get backgroundColor(): string {
        return this.player.getColor().getRgba(this.backgroundAlpha);
    }

    @HostBinding('style.left.%')
    private get left(): number {
        return this.player.getMinX();
    }

    @HostBinding('style.top.%')
    private get top(): number {
        return this.player.getMinY() / PhysicsEnum.HEIGHT_RATIO;
    }

    @HostBinding('style.width.%')
    private get width(): number {
        return this.player.getMaxRightX();
    }

    @HostBinding('style.height.%')
    private get height(): number {
        return (this.player.getMaxBottomY() - this.player.getMinY()) / PhysicsEnum.HEIGHT_RATIO;
    }

    @HostBinding('style.borderTop')
    private get borderTop(): string {
        if (this.top === 0) {
            return '';
        }

        return '1px dashed ' + this.player.getColor().getRgba(this.borderAlpha);
    }

    @HostBinding('style.borderBottom')
    private get borderBottom(): string {
        if (this.top !== 0) {
            return '';
        }

        return '1px dashed ' + this.player.getColor().getRgba(this.borderAlpha);
    }

    @HostBinding('style.color')
    private get color(): string {
        return this.player.getColor().getRgba(this.textAlpha);
    }
}
