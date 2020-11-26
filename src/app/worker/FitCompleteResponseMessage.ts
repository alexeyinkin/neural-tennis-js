import ResponseMessageInterface from './ResponseMessageInterface';
import TensorDump from '../TensorDump';

export default interface FitCompleteResponseMessage extends ResponseMessageInterface {
    callbackData: any;
    newWeights: TensorDump[][];
}
