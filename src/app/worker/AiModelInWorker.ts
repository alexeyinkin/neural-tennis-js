import { DenseLayerArgs } from '@tensorflow/tfjs-layers/dist/layers/core';

import CommandEnum from './CommandEnum';
import FitCompleteResponseMessage from './FitCompleteResponseMessage';
import AiModelInWorkerListener from './AiModelInWorkerListener';
import ResponseMessageEnum from './ResponseMessageEnum';
import ResponseMessageInterface from './ResponseMessageInterface';
import TensorDump from '../TensorDump';

export default class AiModelInWorker {
    private worker: Worker;
    private listeners: AiModelInWorkerListener[] = [];
    private nextRequestId = 1n;

    public constructor() {
        this.worker = new Worker('./ai-model.worker', { type: 'module' });
        this.worker.onmessage = ({ data }) => this.handleMessage(data);
    }

    private handleMessage(data: ResponseMessageInterface): void {
        console.log(data);
        switch (data.message) {
            case ResponseMessageEnum.FIT_COMPLETE:
                this.onFitComplete(data as FitCompleteResponseMessage);
                break;
        }
    }

    private onFitComplete(message: FitCompleteResponseMessage): void {
        for (const listener of this.listeners) {
            listener.onFitComplete(message.callbackData, message.newWeights);
        }
    }

    public addListener(listener: AiModelInWorkerListener): void {
        this.listeners.push(listener);
    }

    public create(denseLayerArgs: DenseLayerArgs[], initialWeights: TensorDump[][]): void {
        const request = {
            command:        CommandEnum.CREATE,
            layers:         denseLayerArgs,
            initialWeights: initialWeights,
        };

        this.postMessage(request);
    }

    public fit(inputs: number[][], labels: number[][]): void {
        const request = {
            command: CommandEnum.FIT,
            inputs: inputs,
            labels: labels,
        };

        this.postMessage(request);
    }

    private postMessage(message: any): void {
        if (!message.id) {
            message.id = this.nextRequestId++;
        }

        this.worker.postMessage(message);
    }
}
