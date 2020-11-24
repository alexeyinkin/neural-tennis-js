import AbstractCatchModel from './AbstractCatchModel';
import AbstractKickModel from './AbstractKickModel';
import AbstractPlayerControlModel from './AbstractPlayerControlModel';
import AccelerationCalculator from './AccelerationCalculator';
import Ball from './Ball';
import Engine from './Engine';
import Player from './Player';
import Vector from './Vector';

export default class AiPlayerControlModel extends AbstractPlayerControlModel {
    private accelerationCalculator = new AccelerationCalculator();
    private catchModel?: AbstractCatchModel;
    private kickModel?: AbstractKickModel;

    public constructor(private engine: Engine, private player: Player) {
        super();
    }

    public getAcceleration(): Vector {
        let dst = this.getDesiredPosition();

        if (typeof dst === 'undefined') {
            return this.player.getSpeed().invert(); // Stop.
        }

        return this.accelerationCalculator.calculateByPositions(this.player.getPosition(), dst, this.player.getSpeed());
    }

    private getDesiredPosition(): Vector|undefined {
        let bestBall = this.getBestBall();

        if (typeof bestBall === 'undefined') {
            return undefined;
        }

        if (this.kickModel && this.kickModel.isBallWithinKick(bestBall)) {
            if (this.catchModel) {
                this.catchModel.onBallWithinKick(bestBall);
            }
            return this.kickModel.getPosition(bestBall);
        }

        if (this.catchModel) {
            return this.catchModel.getPosition(bestBall);
        }

        return undefined;
    }

    // TODO: Add BestBallSelectionModel.
    private getBestBall(): Ball|undefined {
        let bestBall: Ball|undefined;
        let bestBallDistance = 0;
        let catchLineY = this.getCatchLineY();
        let playerCenterPosition = this.player.getCenterPosition();

        for (let ball of this.engine.getBalls()) {
            if (ball.isApproaching(playerCenterPosition)) {
                let x = ball.getXWhenAtY( catchLineY);
                let dst = new Vector(x, catchLineY);
                let toGo = dst.subtract(playerCenterPosition);
                let lengthToGo = toGo.getLength();

                // TODO: Also consider the ball that would get to the catch line first
                //       if the nearest ball is approaching slower.
                if (typeof bestBall === 'undefined' || lengthToGo < bestBallDistance) {
                    bestBall = ball;
                    bestBallDistance = lengthToGo;
                }
            }
        }

        return bestBall;
    }

    private getCatchLineY(): number {
        return this.catchModel ? this.catchModel.getCatchLineY() : this.player.getY();
    }

    public setCatchModel(model: AbstractCatchModel): void {
        this.catchModel = model;
    }

    public setKickModel(model: AbstractKickModel): void {
        this.kickModel = model;
    }
}
