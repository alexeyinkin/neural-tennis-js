import Ball from './Ball';
import Vector from './Vector';

export default class AbstractPlayerControlModel {
    private id: bigint;

    private static nextId = 0n;

    public constructor() {
        this.id = AbstractPlayerControlModel.nextId++;
    }

    public getId(): bigint {
        return this.id;
    }

    public getAcceleration(): Vector {
        throw 'Override this';
    }

    public getName(): string {
        throw 'Override this';
    }

    public getTitle(): string {
        throw 'Override this';
    }

    public onKick(ball: Ball): void {}
}
