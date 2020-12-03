import { Component, Input } from '@angular/core';
import AiPlayerControlModel from '../AiPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-catch-model-buttons',
    templateUrl: './player-control-catch-model-buttons.component.html',
})
export default class PlayerControlCatchModelButtonsComponent {
    @Input() player!: Player;
    @Input() model!: AiPlayerControlModel;
}
