import {UIElement} from './element';

/**
 * Abstract user interface element (events)
 */
interface AbstractUIElementEvent extends UIElement { }
abstract class AbstractUIElementEvent {

    /**
     * Register an even handler
     * @param eventType Event type
     * @param handler   Handler
     * @return this
     */
    on(eventType: string, handler: (element: UIElement) => void): UIElement {
        this.getNativeElement().addEventListener(eventType, e => {
            e.stopPropagation();
            e.preventDefault();
            e.returnValue = false;
            handler(this);
        }, false);

        return this;
    }

    /**
     * Register a click handler or call click handlers
     * @param handler Click handler
     * @return this
     */
    click(handler?: (e: MouseEvent) => void): UIElement {
        if (handler) {
            this.getNativeElement().addEventListener('click', e => handler(e), false);
        } else {
            this.getNativeElement().click();
        }

        return this;
    }

    /**
     * Register a mouse enter handler
     * @param handler Mouse enter handler
     * @return this
     */
    mouseEnter(handler: (e?: MouseEvent) => void): UIElement {
        this.getNativeElement().addEventListener('mouseenter', handler, false);
        return this;
    }

    /**
     * Register a mouse down handler
     * @param handler Mouse down handler
     * @return this
     */
    mouseDown(handler: (e?: MouseEvent) => void): UIElement {
        this.getNativeElement().addEventListener('mousedown', handler, false);
        return this;
    }

    /**
     * Emit an event
     * @param eventType Event type
     */
    emitEvent(eventType: string): void {
        this.getNativeElement().dispatchEvent(new Event(eventType));
    }

}

export {
    AbstractUIElementEvent
};
