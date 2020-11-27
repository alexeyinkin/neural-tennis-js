import {Component, Input} from '@angular/core';
import ManualPlayerControlModel from '../ManualPlayerControlModel';
import Player from '../Player';

@Component({
    selector: 'app-player-control-manual',
    templateUrl: './player-control-manual.component.html',
})
export class PlayerControlManualComponent {
    @Input() player!: Player;
    @Input() model!: ManualPlayerControlModel;
}
