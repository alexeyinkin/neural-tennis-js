import { Component, Input } from '@angular/core';
import AbstractCatchModel from '../AbstractCatchModel';
import AiPlayerControlModel from '../AiPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-catch-model-button',
    templateUrl: './player-control-catch-model-button.component.html',
})
export default class PlayerControlCatchModelButtonComponent {
    @Input() player!: Player;
    @Input() model!: AiPlayerControlModel;
    @Input() catchModel!: AbstractCatchModel;

    public click(): void {
        this.model.setCatchModelId(this.catchModel.getId());
    }
}
