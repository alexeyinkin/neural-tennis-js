import {Component, Input} from '@angular/core';
import * as FileSaver from 'file-saver';

import NeuralCatchModel from '../NeuralCatchModel';

@Component({
    selector: 'app-player-control-neural',
    templateUrl: './player-control-neural.component.html',
})
export default class PlayerControlNeuralComponent {
    @Input() model!: NeuralCatchModel;

    public handleSave(): void {
        let dump = this.model.export();
        let blob = new Blob([JSON.stringify(dump)], {type: 'application/json'});
        FileSaver.saveAs(blob, "dump.json");
    }

    public handleFileSelected(input: HTMLInputElement): void {
        let files = input.files;
        if (!files) return;

        let file = files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = () => this.handleFileRead(reader);
        reader.readAsText(file);
    }

    private handleFileRead(reader: FileReader): void {
        let str = reader.result as string;

        try {
            let json = JSON.parse(str);
            this.model.import(json);
        } catch (ex) {}
    }
}
