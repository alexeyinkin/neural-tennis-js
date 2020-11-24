import AiPlayerControlModel from './AiPlayerControlModel';
import Ball from './Ball';
import BallKickedListener from './BallKickedListener';
import BallLostListener from './BallLostListener';
import Color from './Color';
import ExtrapolationCatchModel from './ExtrapolationCatchModel';
import FrontKickModel from './FrontKickModel';
import KeyCodeEnum from './KeyCodeEnum';
import ManualPlayerControlModel from './ManualPlayerControlModel';
import NeuralCatchModel from './NeuralCatchModel';
import ObjectMoveListener from './ObjectMoveListener';
import PhysicalObject from './PhysicalObject';
import PhysicsEnum from './PhysicsEnum';
import Player from './Player';
import Vector from './Vector';
import RandomKickModel from './RandomKickModel';
import XAccelerationKickModel from './XAccelerationKickModel';

export default class Engine {
    private bluePlayer!: Player;
    private redPlayer!: Player;

    private balls: Ball[] = [];
    private players: Player[] = [];
    private objects: PhysicalObject[] = [];
    private manualPlayerControlModels: ManualPlayerControlModel[] = [];

    private ballLostListeners: BallLostListener[] = [];
    private ballKickedListeners: BallKickedListener[] = [];
    private objectMoveListeners: ObjectMoveListener[] = [];

    private timerId?: number;

    public constructor() {
        this.createBalls();
        this.createPlayers();
    }

    private createBalls(): void {
        for (let i = PhysicsEnum.BALL_COUNT; --i >= 0;) {
            this.createBall();
        }
    }

    private createBall(): void {
        let ball = new Ball(
            PhysicsEnum.BALL_RADIUS,
            PhysicsEnum.BALL_MASS,
            PhysicsEnum.BALL_FRICTION,
            PhysicsEnum.BALL_MAX_SPEED,
        );

        ball.setX((PhysicsEnum.FIELD_WIDTH - ball.getWidth()) / 2);
        ball.setY((PhysicsEnum.FIELD_HEIGHT - ball.getHeight()) / 2);

        let dx = Math.random() * 10 - 5;
        let dy = (Math.random() + 2) * 5 * Math.sign(Math.random() - .5);

        ball.setSpeed(new Vector(dx, dy));

        ball.setMinX(0);
        ball.setMaxRightX(PhysicsEnum.FIELD_WIDTH);

        this.addBall(ball);
    }

    private addBall(ball: Ball): void {
        this.balls.push(ball);
        this.objects.push(ball);
    }

    private removeBall(ball: Ball): void {
        for (let i = this.balls.length; --i >= 0; ) {
            if (this.balls[i].getId() === ball.getId()) {
                this.balls.splice(i, 1);
                break;
            }
        }

        for (let i = this.objects.length; --i >= 0; ) {
            let obj = this.objects[i];
            if (obj instanceof Ball && obj.getId() === ball.getId()) {
                this.objects.splice(i, 1);
                break;
            }
        }

        for (const listener of this.ballLostListeners) {
            listener.onBallLost(ball);
        }
    }

    private createPlayers(): void {
        this.createRedPlayer();
        this.createBluePlayer();
    }

    private createRedPlayer(): void {
        let player = this.createPlayer(new Color(255, 0, 0));

        player.setX((PhysicsEnum.FIELD_WIDTH - PhysicsEnum.PLAYER_WIDTH) / 2);
        player.setY(PhysicsEnum.PLAYER_OFFSET);

        player.setMinX(0);
        player.setMaxRightX(PhysicsEnum.FIELD_WIDTH);
        player.setMinY(0);
        player.setMaxBottomY(PhysicsEnum.FIELD_HEIGHT / 3);

        let manualModel = new ManualPlayerControlModel({
            left:   KeyCodeEnum.RED_PLAYER_LEFT,
            right:  KeyCodeEnum.RED_PLAYER_RIGHT,
            up:     KeyCodeEnum.RED_PLAYER_UP,
            down:   KeyCodeEnum.RED_PLAYER_DOWN,
        });

        player.addControlModel(manualModel);
        this.manualPlayerControlModels.push(manualModel);

        this.addExtrapolationAiModel(player);
        this.addNeuralAiModel(player);

        this.redPlayer = player;
        this.addPlayer(player);
    }

    private createBluePlayer(): void {
        let player = this.createPlayer(new Color(0, 0, 255));

        player.setX((PhysicsEnum.FIELD_WIDTH - PhysicsEnum.PLAYER_WIDTH) / 2);
        player.setY(PhysicsEnum.FIELD_HEIGHT - PhysicsEnum.PLAYER_OFFSET - PhysicsEnum.PLAYER_HEIGHT);

        player.setMinX(0);
        player.setMaxRightX(PhysicsEnum.FIELD_WIDTH);
        player.setMinY(PhysicsEnum.FIELD_HEIGHT / 3 * 2);
        player.setMaxBottomY(PhysicsEnum.FIELD_HEIGHT);

        let manualModel = new ManualPlayerControlModel({
            left:   KeyCodeEnum.BLUE_PLAYER_LEFT,
            right:  KeyCodeEnum.BLUE_PLAYER_RIGHT,
            up:     KeyCodeEnum.BLUE_PLAYER_UP,
            down:   KeyCodeEnum.BLUE_PLAYER_DOWN,
        });

        player.addControlModel(manualModel);
        this.manualPlayerControlModels.push(manualModel);

        this.addExtrapolationAiModel(player);
        this.addNeuralAiModel(player);

        this.bluePlayer = player;
        this.addPlayer(player);
    }

    private addExtrapolationAiModel(player: Player): void {
        let model = new AiPlayerControlModel(this, player);

        model.setCatchModel(new ExtrapolationCatchModel(this, player));
        model.setKickModel(new FrontKickModel(this, player));

        player.addControlModel(model);
    }

    private addNeuralAiModel(player: Player): void {
        let model = new AiPlayerControlModel(this, player);

        model.setCatchModel(new NeuralCatchModel(this, player));
        model.setKickModel(new FrontKickModel(this, player));

        player.addControlModel(model);
    }

    private createPlayer(color: Color): Player {
        return new Player(
            color,
            PhysicsEnum.PLAYER_WIDTH,
            PhysicsEnum.PLAYER_HEIGHT,
            PhysicsEnum.PLAYER_MASS,
            PhysicsEnum.PLAYER_FRICTION,
            PhysicsEnum.PLAYER_MAX_SPEED,
            PhysicsEnum.PLAYER_MAX_ACCELERATION,
        );
    }

    private addPlayer(player: Player): void {
        this.players.push(player);
        this.objects.push(player);
    }

    private tick(): void {
        this.applyControlAcceleration();
        this.moveObjects();
        this.handleBallKicks();
        this.checkGoal();
        this.removeStoppedBalls();
    }

    private applyControlAcceleration(): void {
        for (let player of this.players) {
            let model = player.getControlModel();

            if (model) {
                let acceleration = model.getAcceleration();
                player.setAcceleration(acceleration);
            }
        }
    }

    private moveObjects(): void {
        for (let obj of this.objects) {
            obj.move();

            for (let listener of this.objectMoveListeners) {
                listener.onObjectMove(obj);
            }
        }
    }

    private handleBallKicks(): void {
        for (let player of this.players) {
            for (let ball of this.balls) {
                this.checkAndHandleIfKicked(player, ball);
            }
        }
    }

    private checkAndHandleIfKicked(player: Player, ball: Ball): void {
        let kicking = player.isKicking(ball);
        if (!kicking) return;

        for (const listener of this.ballKickedListeners) {
            listener.beforeBallKicked(player, ball);
        }

        player.checkAndHandleIfKicked(ball);

        for (const listener of this.ballKickedListeners) {
            listener.onBallKicked(player, ball);
        }
    }

    private checkGoal(): void {
        for (let i = this.balls.length; --i >= 0; ) {
            let ball = this.balls[i];

            if (ball.getY() < -ball.getHeight()) {
                this.bluePlayer.addScore();
                this.removeBall(ball);
            } else if (ball.getY() > this.getFieldHeight()) {
                this.redPlayer.addScore();
                this.removeBall(ball);
            }
        }

        if (this.balls.length === 0) {
            this.createBalls();
        }
    }

    private removeStoppedBalls(): void {
        for (let i = this.balls.length; --i >= 0; ) {
            let ball = this.balls[i];
            if (ball.getSpeed().getLength() === 0) {
                this.removeBall(ball);
            }
        }

        if (this.balls.length === 0) {
            this.createBalls();
        }
    }

    public startTicking(): void {
        if (this.timerId) {
            return;
        }

        this.timerId = setInterval(() => this.tick(), PhysicsEnum.TICK_INTERVAL_MS);
    }

    private stopTicking(): void {
        if (!this.timerId) {
            return;
        }

        clearInterval(this.timerId);
        this.timerId = undefined;
    }

    private toggleTicking(): void {
        if (this.timerId) {
            this.stopTicking();
        } else {
            this.startTicking();
        }
    }

    public handleKeyDown(code: string) {
        switch (code) {
            case 'Escape':
                this.toggleTicking();
                break;
        }

        for (let model of this.manualPlayerControlModels) {
            model.handleKeyDown(code);
        }
    }

    public handleKeyUp(code: string) {
        for (let model of this.manualPlayerControlModels) {
            model.handleKeyUp(code);
        }
    }

    public getBalls(): Ball[] {
        return this.balls;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getFieldWidth(): number {
        return PhysicsEnum.FIELD_WIDTH;
    }

    public getFieldHeight(): number {
        return PhysicsEnum.FIELD_HEIGHT;
    }

    public addBallLostListener(listener: BallLostListener): void {
        this.ballLostListeners.push(listener);
    }

    public addBallKickedListener(listener: BallKickedListener): void {
        this.ballKickedListeners.push(listener);
    }

    public addObjectMoveListener(listener: ObjectMoveListener): void {
        this.objectMoveListeners.push(listener);
    }

    public normalizeWidth(width: number): number {
        return width / this.getFieldWidth();
    }

    public denormalizeWidth(width: number): number {
        return width * this.getFieldWidth();
    }

    public normalizeHeight(height: number): number {
        return height / this.getFieldHeight();
    }

    public denormalizeHeight(height: number): number {
        return height * this.getFieldHeight();
    }
}