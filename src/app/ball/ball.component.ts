import {Component, HostBinding, Input} from '@angular/core';
import Ball from '../Ball';

@Component({
    selector: 'app-ball',
    template: '',
    styleUrls: ['./ball.component.scss']
})
export default class BallComponent {
    @Input() ball!: Ball;

    @HostBinding('style.width.px')
    private get width(): number {
        return this.ball.getWidth();
    }

    @HostBinding('style.height.px')
    private get height(): number {
        return this.ball.getHeight();
    }

    @HostBinding('style.left.px')
    private get x(): number {
        return this.ball.getX();
    }

    @HostBinding('style.top.px')
    private get y(): number {
        return this.ball.getY();
    }

    public constructor() { }
}
