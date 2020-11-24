export default class Vector {
    public constructor(
        private readonly x: number,
        private readonly y: number,
    ) {}

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getLength(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public capLength(maxLength: number): Vector {
        let x = this.x;
        let y = this.y;
        let length = this.getLength();

        if (length > maxLength) {
            x = x / length * maxLength;
            y = y / length * maxLength;
        }

        return new Vector(x, y);
    }

    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    public withLength(length: number): Vector {
        let angle = Math.atan2(this.x, this.y);
        let x = Math.sin(angle) * length;
        let y = Math.cos(angle) * length;

        return new Vector(x, y);
    }

    public add(another: Vector): Vector {
        return new Vector(this.x + another.x, this.y + another.y);
    }

    public invert(): Vector {
        return new Vector(-this.x, -this.y);
    }

    public subtract(another: Vector): Vector {
        return this.add(another.invert());
    }
}
