import {UIElement} from './element';
import {UIElementBase} from './element-base';

/**
 * Abstract user interface element (query)
 */
interface AbstractUIElementQuery extends UIElement {}
abstract class AbstractUIElementQuery {

    /**
     * Select an element
     * @param selector Selector
     * @return Element
     */
    element(...selector: string[]): UIElement {
        let element: HTMLElement = this.selectNativeElement<HTMLElement>(...selector);
        if (element) {
            return new UIElementBase(element);
        }

        return null;
    }

    /**
     * Select a native element
     * @param selectorParts Selector parts
     * @return Native element
     */
    selectNativeElement<E extends Element>(...selectorParts: string[]): E {
        let selectorString: string = this.buildQuerySelector(...selectorParts);
        let element: E = <E> this.getNativeElement().querySelector(selectorString);
        return element;
    }

    /**
     * Select multiple elements
     * @param selector Select
     * @return Elements
     */
    elements(...selector: string[]): UIElement[] {
        let elements: UIElement[] = [];
        this.selectNativeElements<HTMLElement>(...selector).forEach(e => elements.push(new UIElementBase(e)));
        return elements;
    }

    /**
     * Select multiple native elements
     * @param selectorParts Selector parts
     * @return Native elements
     */
    selectNativeElements<E extends Element>(...selectorParts: string[]): NodeListOf<E> {
        let selectorString: string = this.buildQuerySelector(...selectorParts);
        let elements: NodeListOf<E> = <NodeListOf<E>> this.getNativeElement().querySelectorAll(selectorString);
        return elements;
    }

    /**
     * Iterate over elements
     * @param callback Callback
     * @param selector Selector
     */
    forEachElement(callback: (element: UIElement) => void, ...selector: string[]): void {
        this.forEachNativeElement<HTMLElement>(e => callback(new UIElementBase(e)), ...selector);
    }

    /**
     * Iterate over native elements
     * @param callback Callback
     * @param selector Selector
     */
    forEachNativeElement<E extends Element>(callback: (element: E) => void, ...selector: string[]): void {
        this.selectNativeElements<E>(...selector).forEach(e => callback(e));
    }

    /**
     * Build a query selector string
     * @param selectorParts Selector parts
     * @return Query selector string
     */
    private buildQuerySelector(...selectorParts: string[]): string {
        // NOTE: waiting for https://github.com/tmpvar/jsdom/issues/2028 so that unit tests don't fail
        return /*':scope>' + */selectorParts.join('>');
    }

}

export {
    AbstractUIElementQuery
};
