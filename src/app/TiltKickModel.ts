import AbstractKickModel from './AbstractKickModel';
import Ball from './Ball';
import Vector from './Vector';

export default class TiltKickModel extends AbstractKickModel {
    public getName(): string {
        return 'tilt';
    }

    public getTitle(): string {
        return 'Tilt';
    }

    public getPosition(ball: Ball): Vector {
        let player = this.getPlayer();

        return new Vector(
            player.getX() + Math.sign(ball.getDx()) * 500, // Speed up along ball x speed.
            player.getY() - Math.sign(ball.getDy()) * 500,  // Speed up towards ball by Y axis.
        );
    }
}
