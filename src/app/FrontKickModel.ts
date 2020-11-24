import AbstractKickModel from './AbstractKickModel';
import Ball from './Ball';
import Vector from './Vector';

export default class FrontKickModel extends AbstractKickModel {
    public getPosition(ball: Ball): Vector {
        let player = this.getPlayer();

        return new Vector(
            player.getX(),
            player.getY() - Math.sign(ball.getDy()) * 50, // Speed up towards ball by Y axis.
        );
    }
}
