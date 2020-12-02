import AbstractPlayerControlModel from './AbstractPlayerControlModel';
import AiPlayerControlModel from './AiPlayerControlModel';
import Ball from './Ball';
import Color from './Color';
import ManualPlayerControlModel from './ManualPlayerControlModel';
import PhysicalObject from './PhysicalObject';
import Vector from './Vector';

export default class Player extends PhysicalObject {
    private readonly id: bigint;
    private name: string;

    private acceleration: Vector = new Vector(0, 0);
    private score = 0;

    private controlModels: AbstractPlayerControlModel[] = [];
    private controlModelIndex = 0;

    private static nextId: bigint = 1n;

    public constructor(
        private color: Color,
        width: number,
        height: number,
        mass: number,
        friction: number,
        maxSpeed: number,
        private maxAcceleration: number,
    ) {
        super(width, height, mass, friction, maxSpeed);

        this.id = Player.nextId++;
        this.name = 'Player ' + this.id;
    }

    public isKicking(ball: Ball): boolean {
        return this.isKickingWithTopSurface(ball) || this.isKickingWithBottomSurface(ball);
    }

    public checkAndHandleIfKicked(ball: Ball): void {
        if (this.isKickingWithTopSurface(ball)) {
            this.kickWithTopSurface(ball);
            return;
        }

        if (this.isKickingWithBottomSurface(ball)) {
            this.kickWithBottomSurface(ball);
            return;
        }
    }

    private isKickingWithTopSurface(ball: Ball): boolean {
        if (ball.getPrevY() + ball.getHeight() < this.getPrevY()) {
            if (ball.getY() + ball.getHeight() >= this.getY()) {
                if (ball.getX() + ball.getWidth() * .7 > this.getX() && ball.getX() + ball.getWidth() * .3 < this.getX() + this.getWidth()) {
                    return true;
                }
            }
        }

        return false;
    }

    private isKickingWithBottomSurface(ball: Ball): boolean {
        if (ball.getPrevY() > this.getPrevY() + this.getHeight()) {
            if (ball.getY() <= this.getY() + this.getHeight()) {
                if (ball.getX() + ball.getWidth() * .7 > this.getX() && ball.getX() + ball.getWidth() * .3 < this.getX() + this.getWidth()) {
                    return true;
                }
            }
        }

        return false;
    }

    private kickWithTopSurface(ball: Ball): void {
        let dx = ball.getDx() + this.getDx() * .8;
        let dy = -ball.getDy() + this.getDy();
        ball.setSpeed(new Vector(dx, dy));
        ball.setBottomY(this.getY());
        this.onKick(ball);
    }

    private kickWithBottomSurface(ball: Ball): void {
        let dx = ball.getDx() + this.getDx() * .8;
        let dy = -ball.getDy() + this.getDy();
        ball.setSpeed(new Vector(dx, dy));
        ball.setY(this.getY() + this.getHeight());
        this.onKick(ball);
    }

    private onKick(ball: Ball): void {
        let model = this.getControlModel();

        if (model) {
            model.onKick(ball);
        }
    }

    public addControlModel(model: AbstractPlayerControlModel): void {
        this.controlModels.push(model);

        if (this.controlModels.length === 1) {
            this.controlModelIndex = 0;
        }
    }

    public getControlModel(): AbstractPlayerControlModel {
        return this.controlModels[this.controlModelIndex];
    }

    public getControlModels(): AbstractPlayerControlModel[] {
        return this.controlModels;
    }

    public getAiControlModel(): AiPlayerControlModel {
        for (const model of this.controlModels) {
            if (model.getName() === 'ai') {
                return model as AiPlayerControlModel;
            }
        }

        throw 'Model not found';
    }

    public getManualControlModel(): ManualPlayerControlModel {
        for (const model of this.controlModels) {
            if (model.getName() === 'manual') {
                return model as ManualPlayerControlModel;
            }
        }

        throw 'Model not found';
    }

    public setAcceleration(acceleration: Vector): void {
        this.acceleration = acceleration.capLength(this.maxAcceleration);
    }

    public move(): void {
        this.setSpeed(this.getSpeed().add(this.acceleration));
        super.move();
    }

    public addScore(): void {
        this.score++;
    }

    public getScore(): number {
        return this.score;
    }

    public getColor(): Color {
        return this.color;
    }

    public switchToNextControlModel(): void {
        let nextIndex = this.controlModelIndex + 1;
        if (nextIndex >= this.controlModels.length) {
            nextIndex %= this.controlModels.length;
        }

        this.controlModelIndex = nextIndex;
    }

    public setControlModelId(id: bigint): void {
        for (let i = this.controlModels.length; --i >= 0; ) {
            if (this.controlModels[i].getId() === id) {
                this.controlModelIndex = i;
                return;
            }
        }
    }

    public getId(): bigint {
        return this.id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
}
