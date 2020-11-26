import TensorDump from '../TensorDump';

export default interface AiModelInWorkerListener {
    onFitComplete(callbackData: any, newWeights: TensorDump[][]): void;
}
