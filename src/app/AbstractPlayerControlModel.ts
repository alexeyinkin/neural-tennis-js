import Ball from './Ball';
import Vector from './Vector';

export default class AbstractPlayerControlModel {
    public getAcceleration(): Vector {
        throw 'Override this';
    }

    public onKick(ball: Ball): void {}
}
