import {Component, Input} from '@angular/core';
import Player from '../Player';

@Component({
    selector: 'app-player-control',
    templateUrl: './player-control.component.html',
})
export class PlayerControlComponent {
    @Input() player!: Player;
}
