import RequestMessageInterface from './RequestMessageInterface';

export default interface FitRequestMessageInterface extends RequestMessageInterface {
    inputs: number[][];
    labels: number[][];
}
