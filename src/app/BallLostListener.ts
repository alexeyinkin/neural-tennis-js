import Ball from './Ball';

export default interface BallLostListener {
    onBallLost(ball: Ball): void;
}
