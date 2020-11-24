import PhysicalObject from './PhysicalObject';

export default class Ball extends PhysicalObject{
    id: bigint;

    static nextId: bigint = 0n;

    constructor(radius: number, mass: number, friction: number, maxSpeed?: number) {
        super(radius * 2, radius * 2, mass, friction, maxSpeed);
        this.id = Ball.nextId++;
    }

    public getId(): bigint {
        return this.id;
    }
}
