import { DenseLayerArgs } from '@tensorflow/tfjs-layers/dist/layers/core';

import RequestMessageInterface from './RequestMessageInterface';
import TensorDump from '../TensorDump';

export default interface CreateRequestMessageInterface extends RequestMessageInterface {
    layers:         DenseLayerArgs[];
    initialWeights: TensorDump[][];
}
