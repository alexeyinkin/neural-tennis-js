import Vector from './Vector';

export default class PhysicalObject {
    private position        = new Vector(0, 0);
    private prevPosition    = new Vector(0, 0);
    private halfSize: Vector;

    private minX?: number;
    private minY?: number;
    private maxRightX?: number;
    private maxBottomY?: number;

    private speed = new Vector(0, 0);

    public constructor(
        private width: number,
        private height: number,
        private mass: number,
        private friction: number,
        private maxSpeed?: number,
    ) {
        this.halfSize = new Vector(width / 2, height / 2);
    }

    public setMinX(minX: number): void {
        this.minX = minX;
    }

    public getMinX(): number|undefined {
        return this.minX;
    }

    public setMinY(minY: number): void {
        this.minY = minY;
    }

    public getMinY(): number|undefined {
        return this.minY;
    }

    public setMaxRightX(maxRightX: number): void {
        this.maxRightX = maxRightX;
    }

    public getMaxX(): number|undefined {
        if (typeof this.maxRightX === 'undefined') {
            return undefined;
        }
        return this.maxRightX - this.width;
    }

    public getMaxRightX(): number|undefined {
        return this.maxRightX;
    }

    public setMaxBottomY(maxBottomY: number): void {
        this.maxBottomY = maxBottomY;
    }

    public getMaxBottomY(): number|undefined {
        return this.maxBottomY;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public setPosition(position: Vector): void {
        this.position = position;
        this.prevPosition = position;
    }

    public setX(x: number) {
        this.setPosition(new Vector(x, this.position.getY()));
    }

    public getPosition(): Vector {
        return this.position;
    }

    public getX(): number {
        return this.position.getX();
    }

    public getRightX(): number {
        return this.position.getX() + this.width;
    }

    public setY(y: number): void {
        this.setPosition(new Vector(this.position.getX(), y));
    }

    public setBottomY(y: number): void {
        this.setY(y - this.height);
    }

    public getY(): number {
        return this.position.getY();
    }

    public getPrevY(): number {
        return this.prevPosition.getY();
    }

    public setSpeed(speed: Vector): void {
        if (typeof this.maxSpeed !== 'undefined') {
            speed = speed.capLength(this.maxSpeed);
        }
        this.speed = speed;
    }

    public getSpeed(): Vector {
        return this.speed;
    }

    public getDx(): number {
        return this.speed.getX();
    }

    public getDy(): number {
        return this.speed.getY();
    }

    public move(): void {
        this.savePreviousPosition();
        this.slowDownWithFriction();
        this.applySpeedToMove();
        this.bounceAtBoundaries();
    }

    private savePreviousPosition(): void {
        this.prevPosition = this.position;
    }

    private slowDownWithFriction(): void {
        if (this.speed.isZero()) {
            return;
        }

        let scalarSpeed = this.speed.getLength();

        if (scalarSpeed <= this.friction) {
            this.speed = new Vector(0, 0);
        } else {
            this.speed = this.speed.withLength(scalarSpeed - this.friction);
        }
    }

    private applySpeedToMove(): void {
        this.position = this.position.add(this.speed);
    }

    private bounceAtBoundaries(): void {
        if (typeof this.minX !== 'undefined' && this.getX() < this.minX) {
            this.setX(this.minX + (this.minX - this.getX()));
            this.setSpeed(new Vector(-this.getDx(), this.getDy()));
        }

        if (typeof this.maxRightX !== 'undefined' && this.getX() + this.width > this.maxRightX) {
            this.setX(this.maxRightX - this.width - (this.getX() + this.width - this.maxRightX));
            this.setSpeed(new Vector(-this.getDx(), this.getDy()));
        }

        if (typeof this.minY !== 'undefined' && this.getY() < this.minY) {
            this.setY(this.minY + (this.minY - this.getY()));
            this.setSpeed(new Vector(this.getDx(), -this.getDy()));
        }

        if (typeof this.maxBottomY !== 'undefined' && this.getY() + this.height > this.maxBottomY) {
            this.setY(this.maxBottomY - this.height - (this.getY() + this.height - this.maxBottomY));
            this.setSpeed(new Vector(this.getDx(), -this.getDy()));
        }
    }

    public isApproaching(position: Vector): boolean {
        let distance = position.add(this.halfSize).subtract(this.position).getLength();
        let prevDistance = position.add(this.halfSize).subtract(this.prevPosition).getLength();
        return distance < prevDistance;
    }

    public getCenterPosition(): Vector {
        return this.position.add(this.halfSize);
    }

    // TODO: Consider minX instead of 0 to bounce.
    public getXWhenAtY(y: number): number {
        let dy = y - this.getY();
        let ticksToGo = dy / this.getDy();
        let x = this.getX() + this.getDx() * ticksToGo;

        if (typeof this.maxRightX === 'undefined' || typeof this.minX === undefined) {
            throw 'Not implemented for unbound objects';
        }

        let availableFieldWidth = this.maxRightX - this.getWidth();

        // Imagine the infinite number of fields mirroring the real one side by side.
        // The one to the left is -1, the real one is 0, the one to the right is 1.
        // This is the index of the field where the ball would end up if not bouncing of borders.
        let mirroredFieldIndex = Math.floor(x / availableFieldWidth);
        let xTravelAfterBounce = Math.abs(x % availableFieldWidth);

        if (mirroredFieldIndex >= 0) {
            return mirroredFieldIndex % 2
                ? this.maxRightX - xTravelAfterBounce - this.getWidth()
                : xTravelAfterBounce;
        }

        return mirroredFieldIndex % 2
            ? xTravelAfterBounce
            : this.maxRightX - xTravelAfterBounce - this.getWidth();
    }
}
