import AbstractTouchControlModel from './AbstractTouchControlModel';
import Engine from '../Engine';
import Player from '../Player';
import Vector from '../Vector';

interface PlayerTouches {
    playerId: bigint;
    touches: Touch[];
    fieldPositions: Vector[];
}

export default class TouchDispatcher {
    private touchIdsToPlayerIds = new Map<number, bigint|undefined>();

    public constructor(private engine: Engine) {}

    public handleTouchStart(changedTouches: TouchList, fieldPositions: Vector[]): void {
        this.storePlayerIdsForNewTouches(changedTouches, fieldPositions);

        let playersTouches = this.sortTouchesToPlayers(changedTouches, fieldPositions);

        for (const playerTouches of playersTouches) {
            let model = this.getTouchModelByPlayerId(playerTouches.playerId);
            model.handleTouchStart(playerTouches.touches, playerTouches.fieldPositions);
        }
    }

    private storePlayerIdsForNewTouches(touches: TouchList, fieldPositions: Vector[]): void {
        for (let i = touches.length; --i >= 0; ) {
            let touch = touches[i];
            let player = this.getPlayerByTouchStartPosition(fieldPositions[i]);
            this.touchIdsToPlayerIds.set(touch.identifier, player ? player.getId() : undefined);
        }
    }

    public handleTouchMove(touches: TouchList, fieldPositions: Vector[]): void {
        let playersTouches = this.sortTouchesToPlayers(touches, fieldPositions);

        for (const playerTouches of playersTouches) {
            let model = this.getTouchModelByPlayerId(playerTouches.playerId);
            model.handleTouchMove(playerTouches.touches, playerTouches.fieldPositions);
        }
    }

    public handleTouchEnd(touches: TouchList, fieldPositions: Vector[]): void {
        let players = this.engine.getPlayers();
        let touchesByPlayers = this.mapPlayersToTouches(touches, fieldPositions);

        for (const player of players) {
            let model = player.getManualControlModel().getTouchModel();
            let playerTouches = touchesByPlayers.get(player.getId());

            if (playerTouches) {
                model.handleTouchEnd(playerTouches.touches, playerTouches.fieldPositions);
            } else {
                model.handleTouchEnd([], []);
            }
        }

        if (touches.length === 0) {
            this.touchIdsToPlayerIds.clear();
        }
    }

    private sortTouchesToPlayers(touches: TouchList, fieldPositions: Vector[]): PlayerTouches[] {
        let playersTouchesMap = this.mapPlayersToTouches(touches, fieldPositions);
        return Array.from(playersTouchesMap.values());
    }

    private mapPlayersToTouches(touches: TouchList, fieldPositions: Vector[]): Map<bigint, PlayerTouches> {
        let map = new Map<bigint, PlayerTouches>();

        for (let i = touches.length; --i >= 0; ) {
            let touch = touches[i];
            let playerId = this.touchIdsToPlayerIds.get(touch.identifier);

            if (typeof playerId === 'undefined') continue;

            let playerTouches = map.get(playerId);

            if (!playerTouches) {
                playerTouches = {
                    playerId: playerId,
                    touches: [],
                    fieldPositions: [],
                };
            }

            playerTouches.touches.push(touch);
            playerTouches.fieldPositions.push(fieldPositions[i]);

            map.set(playerId, playerTouches);
        }

        return map;
    }

    private getTouchModelByPlayerId(playerId: bigint): AbstractTouchControlModel {
        let player = this.engine.requirePlayerById(playerId);
        return player.getManualControlModel().getTouchModel();
    }

    public handleTouchCancel(touches: TouchList, fieldPositions: Vector[]): void {
        this.touchIdsToPlayerIds.clear();
    }

    private getPlayerByTouchStartPosition(touchStartPosition: Vector): Player|undefined {
        let x = touchStartPosition.getX();
        let y = touchStartPosition.getY();

        for (const player of this.engine.getPlayers()) {
            if (x >= player.getMinX() && x <= player.getMaxRightX() && y >= player.getMinY() && y <= player.getMaxBottomY()) {
                return player;
            }
        }

        return undefined;
    }

    public isAtLeastOneTouchMissingPlayerArea(touches: TouchList): boolean {
        for (let i = touches.length; --i >= 0; ) {
            if (!this.touchIdsToPlayerIds.get(touches[i].identifier)) {
                return true;
            }
        }

        return false;
    }
}
