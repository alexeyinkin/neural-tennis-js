import AbstractTouchControlModel from './AbstractTouchControlModel';
import AccelerationCalculator from '../AccelerationCalculator';
import Vector from '../Vector';
import Player from '../Player';

export default class GoWhereTappedControlModel extends AbstractTouchControlModel {
    private targetPosition?: Vector;
    private accelerationCalculator = new AccelerationCalculator();

    public constructor(player: Player, private offset: Vector) {
        super(player);
    }

    public getAcceleration(): Vector {
        let player = this.getPlayer();

        if (!this.targetPosition) {
            return player.getSpeed().invert(); // Stop.
        }

        return this.accelerationCalculator.calculateByPositions(
            player.getCenterPosition(),
            this.targetPosition,
            player.getSpeed(),
        )
    }

    public handleTouchStart(touches: Touch[], fieldPositions: Vector[]): void {
        this.updateTargetPosition(fieldPositions[0]);
    }

    public handleTouchMove(touches: Touch[], fieldPositions: Vector[]): void {
        this.updateTargetPosition(fieldPositions[0]);
    }

    public handleTouchEnd(touches: Touch[], fieldPositions: Vector[]): void {
        if (touches.length > 0) {
            this.updateTargetPosition(fieldPositions[0]);
        } else {
            this.targetPosition = undefined;
            this.setInControl(false);
        }
    }

    private updateTargetPosition(fieldPosition: Vector): void {
        this.targetPosition = fieldPosition.add(this.offset);
        this.setInControl(true);
    }
}
