import AbstractCatchModel from './AbstractCatchModel';
import Ball from './Ball';
import Vector from './Vector';

export default class ExtrapolationCatchModel extends AbstractCatchModel {
    public getPosition(ball: Ball): Vector|undefined {
        let catchLineY = this.getCatchLineY();
        let x = ball.getXWhenAtY(catchLineY);

        return this.ballPositionToPlayerPosition(ball, new Vector(x, catchLineY));
    }
}
