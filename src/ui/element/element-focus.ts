import {UIElement} from './element';

/**
 * Abstract user interface element (focus)
 */
interface AbstractUIElementFocus extends UIElement { }
abstract class AbstractUIElementFocus {
    
    /**
     * Give focus to the element
     * @return this
     */
    focus(): UIElement {
        this.getNativeElement().focus();
        return this;
    }

}

export {
    AbstractUIElementFocus
};
