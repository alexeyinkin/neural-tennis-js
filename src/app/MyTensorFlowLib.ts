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
}
