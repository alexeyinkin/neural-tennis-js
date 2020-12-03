import {Component, Input} from '@angular/core';
import AbstractKickModel from '../AbstractKickModel';
import AiPlayerControlModel from '../AiPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-kick-model-button',
    templateUrl: './player-control-kick-model-button.component.html',
    styleUrls: ['./player-control-kick-model-button.component.scss']
})
export default class PlayerControlKickModelButtonComponent {
    @Input() player!: Player;
    @Input() model!: AiPlayerControlModel;
    @Input() kickModel!: AbstractKickModel;

    public click(): void {
        this.model.setKickModelId(this.kickModel.getId());
    }
}
