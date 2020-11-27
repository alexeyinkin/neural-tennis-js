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

    private catchModels: AbstractCatchModel[] = [];
    private catchModelIndex = 0;

    private kickModels: AbstractKickModel[] = [];
    private kickModelIndex = 0;

    public constructor(private engine: Engine, private player: Player) {
        super();
    }

    public getName(): string {
        return 'ai';
    }

    public getTitle(): string {
        return 'AI';
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

        let catchModel = this.getCatchModel();
        let kickModel = this.getKickModel();

        if (kickModel.isBallWithinKick(bestBall)) {
            catchModel.onBallWithinKick(bestBall);
            return kickModel.getPosition(bestBall);
        }

        return catchModel.getPosition(bestBall);
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
        return this.getCatchModel().getCatchLineY();
    }

    public addCatchModel(model: AbstractCatchModel): void {
        this.catchModels.push(model);
    }

    public setCatchModelId(id: bigint): void {
        for (let i = this.catchModels.length; --i >= 0; ) {
            if (this.catchModels[i].getId() === id) {
                this.catchModelIndex = i;
                return;
            }
        }
    }

    public setKickModelId(id: bigint): void {
        for (let i = this.kickModels.length; --i >= 0; ) {
            if (this.kickModels[i].getId() === id) {
                this.kickModelIndex = i;
                return;
            }
        }
    }

    public getCatchModel(): AbstractCatchModel {
        return this.catchModels[this.catchModelIndex];
    }

    public getCatchModels(): AbstractCatchModel[] {
        return this.catchModels;
    }

    public addKickModel(model: AbstractKickModel): void {
        this.kickModels.push(model);
    }

    public getKickModel(): AbstractKickModel {
        return this.kickModels[this.kickModelIndex];
    }

    public getKickModels(): AbstractKickModel[] {
        return this.kickModels;
    }
}
