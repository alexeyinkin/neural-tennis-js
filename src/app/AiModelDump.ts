import TensorDump from './TensorDump';

export default interface AiModelDump {
    name: string;
    shape: number[];
    inputs: number[][];
    labels: number[][];
    weights: TensorDump[][];
}
