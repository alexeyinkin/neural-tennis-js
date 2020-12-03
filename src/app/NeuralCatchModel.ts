import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Sequential } from '@tensorflow/tfjs';
import { DenseLayerArgs } from '@tensorflow/tfjs-layers/dist/layers/core';

import AbstractCatchModel from './AbstractCatchModel';
import AiModelDump from './AiModelDump';
import AiModelInWorker from './worker/AiModelInWorker';
import AiModelInWorkerListener from './worker/AiModelInWorkerListener';
import Ball from './Ball';
import BallKickedListener from './BallKickedListener';
import BallLostListener from './BallLostListener';
import ChartContainerProviderInterface from './ChartContainerProviderInterface';
import Engine from './Engine';
import MyTensorFlowLib from './MyTensorFlowLib';
import ObjectMoveListener from './ObjectMoveListener';
import PhysicalObject from './PhysicalObject';
import Player from './Player';
import PointInterface from './VectorInterface';
import TensorDump from './TensorDump';
import Vector from './Vector';

export default class NeuralCatchModel extends AbstractCatchModel implements BallLostListener, BallKickedListener, ObjectMoveListener, AiModelInWorkerListener {
    private static DUMP_NAME = 'NeuralCatchModel';

    private expectedPositions = new Map<bigint, Vector>();
    private activeBallsData = new Map<bigint, number[][]>();

    private readonly model: Sequential;
    private inputHistory: number[][] = [];
    private labelHistory: number[][] = [];

    private errors: number[] = [];
    //private rollingErrorsCount = [1, 5];
    private rollingErrorsCount = [1]; // Drawing the chart is a bottleneck, so skip rolling 5 for now.
    private rollingErrorsPlotValues = new Map<number, PointInterface[]>();

    private lossValues: number[] = [];
    private lossPlotValues: PointInterface[] = [];
    private readonly layers: DenseLayerArgs[] = [
        {units: 10, activation: 'relu', inputShape: [4]},
        {units: 10, activation: 'relu'},
        {units:  1, activation: 'relu'}
    ];

    private modelInWorker: AiModelInWorker;
    private chartContainerProvider?: ChartContainerProviderInterface;

    public constructor(engine: Engine, player: Player) {
        super(engine, player);

        this.model = tf.sequential();
        for (const layer of this.layers) {
            this.model.add(tf.layers.dense(layer));
        }

        this.model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });

        for (const n of this.rollingErrorsCount) {
            this.rollingErrorsPlotValues.set(n, []);
        }

        this.modelInWorker = new AiModelInWorker();
        this.modelInWorker.addListener(this);
        this.modelInWorker.create(this.layers, MyTensorFlowLib.exportWeights(this.model));

        engine.addBallLostListener(this);
        engine.addBallKickedListener(this);
        engine.addObjectMoveListener(this);
    }

    public getName(): string {
        return 'neural';
    }

    public getTitle(): string {
        return 'Neural';
    }

    public getPosition(ball: Ball): Vector|undefined {
        let id = ball.getId();
        let ballCurrentData = this.getBallData(ball);
        let ballData = this.activeBallsData.get(id) || [];

        if (ballData.length === 0) {
            ballData.push(ballCurrentData);
            this.activeBallsData.set(id, ballData);
        }

        if (!this.expectedPositions.has(id)) {
            tf.tidy(
                () => { this.expectedPositions.set(id, this.predictPosition(ball)) }
            );
        }

        return this.expectedPositions.get(id);
    }

    private getBallData(ball: Ball): number[] {
        return [
            this.getEngine().normalizeWidth(ball.getX()),
            this.getEngine().normalizeHeight(ball.getY()),
            this.getEngine().normalizeWidth(ball.getDx()) * 50,
            this.getEngine().normalizeHeight(ball.getDy()) * 50,
        ];
    }

    private predictPosition(ball: Ball): Vector {
        let data = this.getBallData(ball);
        let tensor = tf.tensor2d(data, [1, 4]);
        let prediction = this.model.predict(tensor) as tf.Tensor;
        let predictionData = prediction.dataSync();
        let x = this.getEngine().denormalizeWidth(predictionData[0]);

        return this.ballPositionToPlayerPosition(ball, new Vector(x, this.getCatchLineY()));
    }

    public onBallLost(ball: Ball): void {
        this.cleanActiveBallData(ball);
    }

    public beforeBallKicked(player: Player, ball: Ball): void {
        if (player.getId() === this.getPlayer().getId()) {
            this.extrapolateBallAndLearn(ball);
        }

        this.cleanActiveBallData(ball);
    }

    public cleanActiveBallData(ball: Ball): void {
        this.activeBallsData.delete(ball.getId());
        this.expectedPositions.delete(ball.getId());
    }

    public onBallKicked(player: Player, ball: Ball): void {
    }

    private extrapolateBallAndLearn(ball: Ball): void {
        let y = this.getCatchLineY();
        let ticksToCatchLine = (y - ball.getY()) / ball.getDy();
        let x = ball.getX() + ball.getDx() * ticksToCatchLine;

        let expectedPosition = this.expectedPositions.get(ball.getId());

        if (expectedPosition) {
            this.errors.push(
                this.getEngine().normalizeWidth(
                    Math.abs(x - expectedPosition.getX())
                )
            );

            this.updateRollingErrors();
        }

        let ballDataInputs = this.activeBallsData.get(ball.getId()) || [];
        this.addTrainingData(ballDataInputs, this.getEngine().normalizeWidth(x));
    }

    private addTrainingData(inputs: number[][], labelScalar: number): void {
        if (inputs.length === 0) return;

        this.inputHistory = this.inputHistory.concat(inputs);
        this.labelHistory = this.labelHistory.concat([Array(inputs.length).fill(labelScalar)]);
        this.modelInWorker.fit(this.inputHistory, this.labelHistory);
    }

    private replaceTrainingDataAndWeights(inputs: number[][], labels: number[][], weights: TensorDump[][]): void {
        this.inputHistory = inputs;
        this.labelHistory = labels;
        this.modelInWorker.setWeights(weights);
    }

    private updateRollingErrors(): void {
        for (const n of this.rollingErrorsCount) {
            this.updateRollingError(n);
        }
    }

    private updateRollingError(n: number): void {
        let lastErrors = this.errors.slice(-n);
        let sum = 0;

        lastErrors.forEach(error => sum += error);

        let point = {
            x: this.errors.length,
            y: sum / lastErrors.length,
        };

        (this.rollingErrorsPlotValues.get(n) || []).push(point);
    }

    private plotLoss(): void {
        if (!this.chartContainerProvider) return;
        let container = this.chartContainerProvider.getChartContainer(String(this.getPlayer().getId()));
        if (!container) return;

        // Uncomment this to show charts in TensorFlow's built in side panel.
        //const container = {tab: this.getPlayer().getName(), name: 'MSE'};
        let values = [];
        let series = [];

        values.push(this.lossPlotValues);
        series.push('log10(MSE)');

        this.rollingErrorsPlotValues.forEach((errorPlotValues, n) => {
            values.push(errorPlotValues);
            series.push(n === 1 ? 'Last catch error' : `Rolling ${n} avg error`);
        });

        const data = {
            values,
            series,
        };
        const opts = {
            xLabel: 'Balls observed',
            yLabel: '',
            height: 200,    // TODO: Make adaptive. (With JS?)
            width: 380,
        };

        tfvis.render.linechart(container, data, opts);
    }

    public onObjectMove(obj: PhysicalObject): void {
        if (obj instanceof Ball) {
            this.onBallMove(obj);
        }
    }

    private onBallMove(ball: Ball): void {
        let catchLineY = this.getCatchLineY();
        if (Math.sign(ball.getY() - catchLineY) !== Math.sign(ball.getPrevY() - catchLineY)) {
            this.extrapolateBallAndLearn(ball);
        }
    }

    public onFitComplete(callbackData: any, newWeights: TensorDump[][]): void {
        MyTensorFlowLib.importWeights(this.model, newWeights);

        let loss = callbackData.loss;
        this.lossValues.push(loss);
        this.lossPlotValues.push({x: this.lossPlotValues.length, y: Math.log10(loss)});
        this.plotLoss();
    }

    public export(): AiModelDump {
        return {
            name:       NeuralCatchModel.DUMP_NAME,
            shape:      this.getShape(),
            inputs:     this.inputHistory,
            labels:     this.labelHistory,
            weights:    MyTensorFlowLib.exportWeights(this.model),
        };
    }

    public import(dump: AiModelDump): boolean {
        if (dump.name !== NeuralCatchModel.DUMP_NAME) {
            return false;
        }

        if (JSON.stringify(dump.shape) !== JSON.stringify(this.getShape())) {
            return false;
        }

        this.replaceTrainingDataAndWeights(dump.inputs, dump.labels, dump.weights);
        return true;
    }

    private getShape(): number[] {
        let result = [(this.layers[0].inputShape as number[])[0]];

        for (const layer of this.layers) {
            result.push(layer.units);
        }

        result.push(1);
        return result;
    }

    public setChartContainerProvider(provider?: ChartContainerProviderInterface): void {
        this.chartContainerProvider = provider;
    }
}
