import {Component, Input} from '@angular/core';
import Player from '../Player';

@Component({
    selector: 'app-player-control-model-buttons',
    templateUrl: './player-control-model-buttons.component.html',
})
export default class PlayerControlModelButtonsComponent {
    @Input() player!: Player;
}
