import AbstractKickModel from './AbstractKickModel';
import Ball from './Ball';
import Vector from './Vector';

export default class FrontKickModel extends AbstractKickModel {
    public getName(): string {
        return 'front';
    }

    public getTitle(): string {
        return 'Front';
    }

    public getDescription(): string {
        return 'Kick the ball without sideways motion.';
    }

    public getPosition(ball: Ball): Vector {
        let player = this.getPlayer();

        return new Vector(
            player.getX(),
            player.getY() - Math.sign(ball.getDy()) * 50, // Speed up towards ball by Y axis.
        );
    }
}
