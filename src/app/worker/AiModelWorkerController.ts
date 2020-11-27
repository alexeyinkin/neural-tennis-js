import * as tf from '@tensorflow/tfjs';
import { Sequential } from '@tensorflow/tfjs';

import CommandEnum from './CommandEnum';
import CreateRequestMessageInterface from './CreateRequestMessageInterface';
import FitRequestMessageInterface from './FitRequestMessageInterface';
import MyTensorFlowLib from '../MyTensorFlowLib';
import RequestMessageInterface from './RequestMessageInterface';
import ResponseMessageEnum from './ResponseMessageEnum';
import SetWeightsRequestMessageInterface from "./SetWeightsRequestMessageInterface";

export default class AiModelWorkerController {
    private model?: Sequential;
    private lastStats: any;
    private nextResponseId: bigint = 1n;

    public handleMessage(message: RequestMessageInterface): void {
        switch (message.command) {
            case CommandEnum.CREATE:
                this.create(message as CreateRequestMessageInterface);
                break;

            case CommandEnum.SET_WEIGHTS:
                this.setWeights(message as SetWeightsRequestMessageInterface);
                break;

            case CommandEnum.FIT:
                this.fit(message as FitRequestMessageInterface);
                break;
        }
    }

    private create(message: CreateRequestMessageInterface): void {
        this.model = tf.sequential();

        for (const layer of message.layers) {
            this.model.add(tf.layers.dense(layer));
        }

        this.model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });

        MyTensorFlowLib.importWeights(this.model, message.initialWeights);
    }

    private setWeights(message: SetWeightsRequestMessageInterface): void {
        if (!this.model) return;
        MyTensorFlowLib.importWeights(this.model, message.weights);
    }

    private fit(message: FitRequestMessageInterface): void {
        if (!this.model) return;

        let inputs = tf.tensor2d(message.inputs);
        let labels = tf.tensor2d(message.labels);
        let opts = {
            shuffle: true,
            callbacks: {
                onEpochEnd: (epochIndex: number, stats: any) => this.onEpochEnd(epochIndex, stats),
            },
        };

        this.model.fit(inputs, labels, opts)
            .then(() => {
                this.fitComplete();
                tf.dispose(inputs);
                tf.dispose(labels);
            });
    }

    private onEpochEnd(epochIndex: number, stats: any): void {
        this.lastStats = stats;
    }

    private fitComplete(): void {
        if (!this.model) {
            // TODO: Remove when TypeScript learns to check variable predicates across private method calls.
            //       The model is sure defined if we started fit().
            return;
        }

        const response = {
            message:        ResponseMessageEnum.FIT_COMPLETE,
            callbackData:   this.lastStats,
            newWeights:     MyTensorFlowLib.exportWeights(this.model),
        };

        this.postMessage(response);
    }

    private postMessage(message: any): void {
        if (!message.id) {
            message.id = this.nextResponseId++;
        }

        postMessage(message);
    }
}
