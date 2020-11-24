export default class Color {
    private readonly red:   number;
    private readonly green: number;
    private readonly blue:  number;

    constructor (red: number, green: number, blue: number) {
        this.red   = red;
        this.green = green;
        this.blue  = blue;
    }

    public getRgb(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    public getRgba(alpha: number): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${alpha})`;
    }
}
