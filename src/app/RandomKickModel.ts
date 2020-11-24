import AbstractKickModel from './AbstractKickModel';
import Ball from './Ball';
import Vector from './Vector';

export default class RandomKickModel extends AbstractKickModel {
    public getPosition(ball: Ball): Vector {
        let player = this.getPlayer();

        return new Vector(
            player.getX() + (Math.random() - .5) * 200,
            player.getY() - ball.getDy() * 5, // Speed up towards ball by Y axis.
        );
    }
}
