import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import Engine from '../Engine';
import Vector from '../Vector';

@Component({
    selector: 'app-field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss'],
})
export default class FieldComponent {
    @Input() engine!: Engine;
    @Output() centerAreaClick = new EventEmitter();

    public constructor(private element: ElementRef) {}

    @HostListener('touchstart', ['$event'])
    private handleTouchStart(event: TouchEvent): void {
        let dispatcher = this.engine.getTouchDispatcher();
        dispatcher.handleTouchStart(event.changedTouches, this.getFieldPositions(event.changedTouches));

        if (dispatcher.isAtLeastOneTouchMissingPlayerArea(event.changedTouches)) {
            this.centerAreaClick.emit(null);
        }

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

    @HostListener('click') // If not prevented by touch handling, i.e. on desktop.
    private handleClick(): void {
        this.centerAreaClick.emit(null);
    }

    private getFieldPositions(touches: TouchList): Vector[] {
        let result = [];

        for (let i = 0; i < touches.length; i++) {
            result.push(this.getFieldPosition(touches[i]));
        }

        return result;
    }

    private getFieldPosition(touch: Touch): Vector {
        let rect = this.element.nativeElement.getBoundingClientRect();
        let x = (touch.clientX - rect.left) / rect.width * 100;
        let y = (touch.clientY - rect.top) / rect.width * 100;

        return new Vector(x, y);
    }
}
