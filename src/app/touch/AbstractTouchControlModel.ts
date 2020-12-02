import Player from '../Player';
import Vector from '../Vector';

export default class AbstractTouchControlModel {
    private inControl = false;

    public constructor(private player: Player) {}

    public getAcceleration(): Vector {
        throw 'Override this';
    }

    public handleTouchStart(touches: Touch[], fieldPositions: Vector[]): void {}
    public handleTouchMove(touches: Touch[], fieldPositions: Vector[]): void {}
    public handleTouchEnd(touches: Touch[], fieldPositions: Vector[]): void {}

    public handleTouchCancel(touches: Touch[], fieldPositions: Vector[]): void {
        this.inControl = false;
    }

    protected setInControl(inControl: boolean): void {
        this.inControl = inControl;
    }

    public isInControl(): boolean {
        return this.inControl;
    }

    protected getPlayer(): Player {
        return this.player;
    }
}
