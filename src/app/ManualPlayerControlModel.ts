import AbstractPlayerControlModel from './AbstractPlayerControlModel';
import AbstractTouchControlModel from './touch/AbstractTouchControlModel';
import KeyMapping from './KeyMapping';
import Vector from './Vector';

export default class ManualPlayerControlModel extends AbstractPlayerControlModel {
    private leftPressed     = false;
    private rightPressed    = false;
    private upPressed       = false;
    private downPressed     = false;

    private touchModels: AbstractTouchControlModel[] = [];
    private touchModelIndex = 0; // TODO: Allow changing.

    public constructor(private keyMapping: KeyMapping) {
        super();
    }

    public getName(): string {
        return 'manual';
    }

    public getTitle(): string {
        return '\uD83D\uDC64'; // Bust in Silhouette emoji.
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
        let touchModel = this.getTouchModel();
        if (touchModel.isInControl()) {
            return touchModel.getAcceleration();
        }

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

    public addTouchModel(model: AbstractTouchControlModel): void {
        this.touchModels.push(model);
    }

    public getTouchModel(): AbstractTouchControlModel {
        return this.touchModels[this.touchModelIndex]; // TODO: Allow lack of.
    }
}
