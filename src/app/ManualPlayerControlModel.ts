import AbstractPlayerControlModel from './AbstractPlayerControlModel';
import KeyMapping from './KeyMapping';
import Vector from './Vector';

export default class ManualPlayerControlModel extends AbstractPlayerControlModel {
    private leftPressed     = false;
    private rightPressed    = false;
    private upPressed       = false;
    private downPressed     = false;

    public constructor(private keyMapping: KeyMapping) {
        super();
    }

    public getName(): string {
        return 'manual';
    }

    public getTitle(): string {
        return 'Manual';
    }

    public handleKeyDown(code: string) {
        this.handleKeyUpOrDown(code, true);
    }

    public handleKeyUp(code: string) {
        this.handleKeyUpOrDown(code, false);
    }

    public handleKeyUpOrDown(code: string, pressed: boolean) {
        if (code === this.keyMapping.left) {
            this.leftPressed = pressed;
        }
        if (code === this.keyMapping.right) {
            this.rightPressed = pressed;
        }
        if (code === this.keyMapping.up) {
            this.upPressed = pressed;
        }
        if (code === this.keyMapping.down) {
            this.downPressed = pressed;
        }
    }

    public getAcceleration(): Vector {
        let ddx = 0;
        let ddy = 0;

        if (this.leftPressed) {
            ddx -= 100;
        }

        if (this.rightPressed) {
            ddx += 100;
        }

        if (this.upPressed) {
            ddy -= 100;
        }

        if (this.downPressed) {
            ddy += 100;
        }

        return new Vector(ddx, ddy);
    }

    public getKeyHint(): string {
        return this.keyMapping.hint;
    }
}
