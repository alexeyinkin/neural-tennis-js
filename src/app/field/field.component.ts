import {Component, Input} from '@angular/core';
import Engine from '../Engine';

@Component({
    selector: 'app-field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss']
})
export default class FieldComponent {
    @Input() engine!: Engine;

    public constructor() { }
}
