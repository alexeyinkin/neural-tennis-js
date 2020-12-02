import {Component, HostBinding, Input} from '@angular/core';
import Ball from '../Ball';
import PhysicsEnum from "../PhysicsEnum";

@Component({
    selector: 'app-ball',
    template: '',
    styleUrls: ['./ball.component.scss']
})
export default class BallComponent {
    @Input() ball!: Ball;

    @HostBinding('style.width.%')
    private get width(): number {
        return this.ball.getWidth();
    }

    @HostBinding('style.height.%')
    private get height(): number {
        return this.ball.getHeight() / PhysicsEnum.HEIGHT_RATIO;
    }

    @HostBinding('style.left.%')
    private get x(): number {
        return this.ball.getX();
    }

    @HostBinding('style.top.%')
    private get y(): number {
        return this.ball.getY() / PhysicsEnum.HEIGHT_RATIO;
    }

    public constructor() { }
}
