import {Component, Input} from '@angular/core';
import Player from '../Player';

@Component({
    selector: 'app-player-control',
    templateUrl: './player-control.component.html',
    styleUrls: ['./player-control.component.scss'],
})
export default class PlayerControlComponent {
    @Input() player!: Player;
}
