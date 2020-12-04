import * as tf from '@tensorflow/tfjs';
import { Sequential, Tensor } from '@tensorflow/tfjs';

import TensorDump from './TensorDump';

export default class MyTensorFlowLib {
    public static exportWeights(model: Sequential): TensorDump[][] {
        let result = [];

        for (const layer of model.layers) {
            result.push(MyTensorFlowLib.dumpTensors(layer.getWeights()));
        }

        return result;
    }

    public static dumpTensors(tensors: Tensor[]): TensorDump[] {
        let result = [];

        for (let tensor of tensors) {
            result.push(MyTensorFlowLib.dumpTensor(tensor));
        }

        return result;
    }

    public static dumpTensor(tensor: Tensor): TensorDump {
        return {
            shape: tensor.shape,
            array: Array.from(tensor.dataSync()),
        }
    }

    public static importWeights(model: Sequential, weights: TensorDump[][]) {
        for (let i = model.layers.length; --i >= 0; ) {
            model.layers[i].setWeights(MyTensorFlowLib.dumpsToTensors(weights[i]));
        }
    }

    public static dumpsToTensors(dumps: TensorDump[]): Tensor[] {
        let result = [];

        for (const dump of dumps) {
            result.push(MyTensorFlowLib.dumpToTensor(dump));
        }

        return result;
    }

    public static dumpToTensor(dump: TensorDump): Tensor {
        return tf.tensor(dump.array, dump.shape);
    }

    /**
     * We deal with positive coordinates. If enough weights are negative,
     * then ReLU would produce zero. On that data, its derivative is also zero
     * so error would not backpropagate there and such a unit will never train.
     *
     * See: https://datascience.stackexchange.com/questions/5706/what-is-the-dying-relu-problem-in-neural-networks
     *
     * It might happen with the entire network so that it always outputs zero and never learns.
     * So we should start with an alive network. This method checks if the network is alive
     * with a simplified check that the output is non-zero.
     */
    public static isTrainable(model: Sequential): boolean {
        let inputSpec = model.layers[0].inputSpec[0];
        let axes = inputSpec.axes;

        if (!axes) {
            return false;
        }

        // @ts-ignore
        let inputCount = axes['-1'];

        let input = tf.tensor2d(Array(inputCount).fill(1), [1, inputCount]);
        let predictionTensor = model.predict(input) as Tensor;
        let prediction = predictionTensor.dataSync()[0];

        return prediction !== 0;
    }
}
