import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Sequential, Tensor2D } from '@tensorflow/tfjs';

import AbstractCatchModel from './AbstractCatchModel';
import Ball from './Ball';
import BallKickedListener from './BallKickedListener';
import BallLostListener from './BallLostListener';
import Engine from './Engine';
import ObjectMoveListener from './ObjectMoveListener';
import PhysicalObject from './PhysicalObject';
import Player from './Player';
import PointInterface from './VectorInterface';
import Vector from './Vector';

export default class NeuralCatchModel extends AbstractCatchModel implements BallLostListener, BallKickedListener, ObjectMoveListener {
    private expectedPositions = new Map<bigint, Vector>();
    private activeBallsData = new Map<bigint, number[][]>();

    private model: Sequential;
    private inputHistory = tf.tensor2d([], [0, 4]);
    private labelHistory = tf.tensor2d([], [0, 1]);

    private errors: number[] = [];
    private rollingErrorsCount = [1, 5];
    private rollingErrorsPlotValues = new Map<number, PointInterface[]>();

    private lossValues: number[] = [];
    private lossPlotValues: PointInterface[] = [];

    public constructor(engine: Engine, player: Player) {
        super(engine, player);

        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 10, activation: 'relu', inputShape: [4]}));
        this.model.add(tf.layers.dense({units: 10, activation: 'relu'}));
        this.model.add(tf.layers.dense({units:  1, activation: 'relu'}));

        this.model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });

        for (const n of this.rollingErrorsCount) {
            this.rollingErrorsPlotValues.set(n, []);
        }

        engine.addBallLostListener(this);
        engine.addBallKickedListener(this);
        engine.addObjectMoveListener(this);

        this.plotLoss();
        this.plotWeights();
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

    private addTrainingData(inputsArray: number[][], labelScalar: number): void {
        if (inputsArray.length === 0) return;

        let inputs = tf.tensor2d(inputsArray);
        let labels = tf.tensor2d(Array(inputsArray.length).fill(labelScalar), [inputsArray.length, 1]);

        let inputHistory = tf.concat2d([this.inputHistory, inputs], 0);
        let labelHistory = tf.concat2d([this.labelHistory, labels], 0);

        tf.dispose(this.inputHistory);
        tf.dispose(this.labelHistory);

        this.inputHistory = inputHistory;
        this.labelHistory = labelHistory;
        this.fit(this.inputHistory, this.labelHistory);

        this.plotWeights();
    }

    private fit(inputs: Tensor2D, labels: Tensor2D): void {
        let opts = {
            shuffle: true,
            callbacks: {
                onEpochEnd: (epochIndex: number, stats: any) => this.onEpochEnd(epochIndex, stats),
            },
        };

        this.model.fit(inputs, labels, opts);
    }

    private onEpochEnd(epochIndex: number, stats: any): void {
        let loss = stats.loss;
        this.lossValues.push(loss);
        this.lossPlotValues.push({x: this.lossPlotValues.length, y: Math.log10(loss)});
        this.plotLoss();
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
        const container = {tab: 'Player ' + this.getPlayer().getId(), name: 'MSE'};
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
            height: 300,
        };

        tfvis.render.linechart(container, data, opts);
    }

    private plotWeights(): void {
        const container = {tab: 'Player ' + this.getPlayer().getId(), name: 'Weights'};
        const data = {values: this.getWeights()};
        const opts = {
            height: 400,
        };

        tfvis.render.heatmap(container, data, opts);
    }

    private getWeights(): number[][] {
        let result = [];

        for (const layer of this.model.layers) {
            let layerWeights: number[] = [];
            for (const weightTensor of layer.getWeights()) {
                layerWeights = layerWeights.concat(Array.from(weightTensor.dataSync()));
            }

            result.push(layerWeights);
        }

        return result;
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
}
