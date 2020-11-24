import Vector from './Vector';

export default class AccelerationCalculator {
    public calculateByPositions(fromPosition: Vector, toPosition: Vector, speed: Vector) {
        let delta = toPosition.subtract(fromPosition);

        if (delta.getLength() < 15) {
            return speed.invert();
        }

        // Let the distance also be the acceleration. Only the angle matters as the player will slow down anyway.
        return delta;
    }
}
