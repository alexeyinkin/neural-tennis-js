import {Component, Input} from '@angular/core';
import AiPlayerControlModel from '../AiPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-ai',
    templateUrl: './player-control-ai.component.html',
})
export class PlayerControlAiComponent {
    @Input() player!: Player;
    @Input() model!: AiPlayerControlModel;
}
