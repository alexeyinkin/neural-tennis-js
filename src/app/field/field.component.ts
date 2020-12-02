import {Component, ElementRef, HostListener, Input} from '@angular/core';
import Engine from '../Engine';
import Vector from '../Vector';

@Component({
    selector: 'app-field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss'],
})
export default class FieldComponent {
    @Input() engine!: Engine;

    public constructor(private element: ElementRef) {}

    @HostListener('touchstart', ['$event'])
    private handleTouchStart(event: TouchEvent): void {
        this.engine.getTouchDispatcher().handleTouchStart(event.touches, this.getFieldPositions(event.touches));
        event.preventDefault();
    }

    @HostListener('touchmove', ['$event'])
    private handleTouchMove(event: TouchEvent): void {
        this.engine.getTouchDispatcher().handleTouchMove(event.touches, this.getFieldPositions(event.touches));
        event.preventDefault();
    }

    @HostListener('touchend', ['$event'])
    private handleTouchEnd(event: TouchEvent): void {
        console.log(event);
        this.engine.getTouchDispatcher().handleTouchEnd(event.touches, this.getFieldPositions(event.touches));
        event.preventDefault();
    }

    @HostListener('touchcancel', ['$event'])
    private handleTouchCancel(event: TouchEvent): void {
        this.engine.getTouchDispatcher().handleTouchCancel(event.touches, this.getFieldPositions(event.touches));
        event.preventDefault();
    }

    private getFieldPositions(touches: TouchList): Vector[] {
        let result = [];

        for (let i = 0; i < touches.length; i++) {
            result.push(this.getFieldPosition(touches[i]));
        }

        return result;
    }

    private getFieldPosition(touch: Touch): Vector {
        let parentRect = this.element.nativeElement.getBoundingClientRect();
        let x = touch.clientX - parentRect.left;
        let y = touch.clientY - parentRect.top;

        return new Vector(x, y);
    }
}
