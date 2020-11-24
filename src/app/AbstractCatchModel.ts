import Ball from './Ball';
import Engine from './Engine';
import Player from './Player';
import Vector from './Vector';

export default class AbstractCatchModel {
    static DEFAULT_CATCH_LINE_OFFSET = 20; // From the player's losing line.

    public constructor (private engine: Engine, private player: Player) {
    }

    public getPosition(ball: Ball): Vector|undefined {
        throw 'Override this';
    }

    public getCatchLineY(): number {
        // TODO: A better way to generalize this line. Add lose area to players and check its location?
        if (this.getPlayer().getMinY()) {
            return this.getEngine().getFieldHeight() - AbstractCatchModel.DEFAULT_CATCH_LINE_OFFSET; // Bottom player.
        }

        return AbstractCatchModel.DEFAULT_CATCH_LINE_OFFSET; // Top player.
    }

    public onBallWithinKick(ball: Ball): void {
    }

    protected getEngine(): Engine {
        return this.engine;
    }

    protected getPlayer(): Player {
        return this.player;
    }

    protected ballPositionToPlayerPosition(ball: Ball, ballPosition: Vector): Vector
    {
        let x = ballPosition.getX() - (this.getPlayer().getWidth() - ball.getWidth()) / 2;
        let maxX = this.getPlayer().getMaxX() || Number.MAX_VALUE;

        if (x < 0) {
            x = 0;
        } else if (x > maxX) {
            x = maxX;
        }

        // TODO: Account for player and ball height. Now acting as if they are equal.
        return new Vector(x, ballPosition.getY());
    }
}
