import AbstractKickModel from './AbstractKickModel';
import Ball from './Ball';
import Vector from './Vector';

export default class RandomKickModel extends AbstractKickModel {
    private position?: Vector;

    public isBallWithinKick(ball: Ball): boolean {
        let result = super.isBallWithinKick(ball);

        if (!result) {
            this.position = undefined;
        }

        return result;
    }

    public getPosition(ball: Ball): Vector {
        if (!this.position) {
            this.position = this.choosePosition(ball);
        }

        return this.position;
    }

    private choosePosition(ball: Ball): Vector {
        let player = this.getPlayer();
        let delta = new Vector(
            (Math.random() - .5) * 400,
            -Math.sign(ball.getDy()) * 100,
        );

        return player.getPosition().add(delta);
    }
}
