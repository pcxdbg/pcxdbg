import {UIElement} from './element';

/**
 * Abstract user interface element (DOM)
 */
interface AbstractUIElementDOM extends UIElement { }
abstract class AbstractUIElementDOM {

    /**
     * Attach an element
     * @param element Element to attach
     * @return this
     */
    attach(element: UIElement): UIElement {
        element.attachTo(this);
        return this;
    }

    /**
     * Attach the element to a target
     * @param targetElement Target element
     * @return this
     */
    attachTo(targetElement: UIElement): UIElement {
        targetElement.getChildTarget().getNativeElement().appendChild(this.getNativeElement());
        return this;
    }

    /**
     * Detach the element from its parent container
     * @return this
     */
    detach(): UIElement {
        let nativeElement: HTMLElement = this.getNativeElement();
        let parentNode: HTMLElement = nativeElement.parentElement;
        if (parentNode) {
            parentNode.removeChild(nativeElement);
        }

        return this;
    }

    /**
     * Get the child target
     * @return Child target
     */
    getChildTarget(): UIElement {
        return this;
    }

}

export {
    AbstractUIElementDOM
};
