import Ball from './Ball';
import Engine from './Engine';
import Player from './Player';
import Vector from './Vector';

export default class AbstractKickModel {
    private readonly id: bigint;

    private static nextId = 0n;

    public constructor (private engine: Engine, private player: Player) {
        this.id = AbstractKickModel.nextId++;
    }

    public getName(): string {
        throw 'Override this';
    }

    public getTitle(): string {
        throw 'Override this';
    }

    public getId(): bigint {
        return this.id;
    }

    public isBallWithinKick(ball: Ball): boolean {
        if (ball.getX() < this.player.getX()) {
            return false;
        }

        if (ball.getRightX() > this.player.getRightX()) {
            return false;
        }

        // TODO: Account for heights difference.
        let ticksToCatch = (this.player.getY() - ball.getY()) / ball.getDy();
        return ticksToCatch > 0 && ticksToCatch < 5;
    }

    public getPosition(ball: Ball): Vector {
        throw 'Override this';
    }

    protected getEngine(): Engine {
        return this.engine;
    }

    protected getPlayer(): Player {
        return this.player;
    }
}
