import {Component, Input} from '@angular/core';
import AiPlayerControlModel from '../AiPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-kick-model-buttons',
    templateUrl: './player-control-kick-model-buttons.component.html',
})
export default class PlayerControlKickModelButtonsComponent {
    @Input() player!: Player;
    @Input() model!: AiPlayerControlModel;
}
