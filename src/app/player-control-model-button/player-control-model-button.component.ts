import {Component, Input} from '@angular/core';
import AbstractPlayerControlModel from '../AbstractPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-model-button',
    templateUrl: './player-control-model-button.component.html',
})
export default class PlayerControlModelButtonComponent {
    @Input() player!: Player;
    @Input() model!: AbstractPlayerControlModel;

    public click(): void {
        this.player.setControlModelId(this.model.getId());
    }
}
