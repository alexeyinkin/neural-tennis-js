import PhysicalObject from './PhysicalObject';

export default interface ObjectMoveListener {
    onObjectMove(obj: PhysicalObject): void;
}
