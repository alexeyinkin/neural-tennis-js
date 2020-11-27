import RequestMessageInterface from './RequestMessageInterface';
import TensorDump from '../TensorDump';

export default interface SetWeightsRequestMessageInterface extends RequestMessageInterface {
    weights: TensorDump[][];
}
