import Ball from './Ball';
import Player from './Player';

export default interface BallKickedListener {
    beforeBallKicked(player: Player, ball: Ball): void;
    onBallKicked(player: Player, ball: Ball): void;
}
