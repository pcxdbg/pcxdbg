import {I18nManager} from 'i18n';
import {applicationContext} from 'injection';

/**
 * User interface drag action type
 */
const enum UIDragActionType {
    COPY,
    LINK,
    MOVE
}

/**
 * User interface drag action
 */
interface UIDragAction<T> {
    type: UIDragActionType;
    data?: T;
    completion?: (type: UIDragActionType) => void;
}

/**
 * User interface element
 */
class UIElement {
    protected nativeElement: HTMLElement;

    /**
     * Class constructor
     * @param tagName   Tag name
     * @param innerHTML Inner HTML
     */
    constructor(tagName?: string, innerHTML?: string) {
        if (tagName) {
            this.nativeElement = document.createElement(tagName);

            if (innerHTML) {
                this.nativeElement.innerHTML = innerHTML;
            }
        }
    }

    /**
     * Register a click handler or call click handlers
     * @param handler Click handler
     * @return this
     */
    click(handler?: (e?: MouseEvent) => void): UIElement {
        if (handler) {
            this.nativeElement.addEventListener('click', e => handler(e), false);
        } else {
            this.nativeElement.click();
        }

        return this;
    }

    /**
     * Register a mouse enter handler
     * @param handler Mouse enter handler
     * @return this
     */
    mouseEnter(handler: (e?: MouseEvent) => void): UIElement {
        this.nativeElement.addEventListener('mouseenter', handler, false);
        return this;
    }

    /**
     * Register a mouse down handler
     * @param handler Mouse down handler
     * @return this
     */
    mouseDown(handler: (e?: MouseEvent) => void): UIElement {
        this.nativeElement.addEventListener('mousedown', handler, false);
        return this;
    }

    /**
     * Set the text
     * @param text Text
     * @return this
     */
    text(text: string): UIElement {
        this.nativeElement.innerText = text;
        return this;
    }

    /**
     * Get the text
     * @return Text
     */
    getText(): string {
        return this.nativeElement.innerText;
    }

    /**
     * Set the content as HTML
     * @param html HTML
     * @Return this
     */
    html(html: string): UIElement {
        this.nativeElement.innerHTML = html;
        return this;
    }

    /**
     * Test whether an attribute is set
     * @param attributeName Attribute name
     */
    hasAttribute(attributeName: string): boolean {
        return this.nativeElement.hasAttribute(attributeName);
    }

    /**
     * Set an attribute
     * @param attributeName  Attribute name
     * @param attributeValue Attribute value
     * @return this
     */
    attribute(attributeName: string, attributeValue?: string): UIElement {
        this.nativeElement.setAttribute(attributeName, attributeValue || '');
        return this;
    }

    /**
     * Get an attribute value
     * @param attributeName Attribute name
     * @return Attribute value
     */
    getAttributeValue(attributeName: string): string {
        return this.nativeElement.getAttribute(attributeName);
    }

    /**
     * Remove an attribute
     * @param attributeName Attribute name
     * @return this
     */
    removeAttribute(attributeName: string): UIElement {
        this.nativeElement.removeAttribute(attributeName);
        return this;
    }

    /**
     * Set or get the class name(s)
     * @param classNames Class names
     * @return Class names
     */
    class(...classNames: string[]): string {
        if (classNames.length > 0) {
            this.nativeElement.className = classNames.join(' ');
        }

        return this.nativeElement.className;
    }

    /**
     * Get the class names
     * @return Class names
     */
    classes(): string[] {
        return this.nativeElement.className.split(' ');
    }

    /**
     * Set the i18n properties for the element
     * @param key        Key
     * @param parameters Optional parameters
     * @param options    Options
     * @return this
     */
    i18n(key?: string, parameters?: {[parameterName: string]: any}, ...options: string[]): UIElement {
        let parametersString: string = '';
        let attributeValue: string;

        if (key === undefined) {
            this.nativeElement.removeAttribute('i18n');
            return this;
        }

        if (parameters) {
            parametersString = '(' + JSON.stringify(parameters) + ')';
        }

        if (options && options.length > 0) {
            if (options.length > 1) {
                throw new Error('multiple i18n options not supported yet');
            }

            parametersString = '[' + options[0] + ']' + parametersString;
        }

        attributeValue = parametersString + key;

        this.nativeElement.setAttribute('i18n', attributeValue);

        return this;
    }

    /**
     * Apply translations to the element and all its descendants
     * @return this
     */
    applyTranslations(): UIElement {
        applicationContext.getComponent(I18nManager).translateElement(this.getNativeElement(), true);
        return this;
    }

    /**
     * Give focus to the element
     * @return this
     */
    focus(): UIElement {
        this.nativeElement.focus();
        return this;
    }

    /**
     * Register an even handler
     * @param eventType Event type
     * @param handler   Handler
     * @return this
     */
    on(eventType: string, handler: (element: UIElement) => void): UIElement {
        this.nativeElement.addEventListener(eventType, e => {
            e.stopPropagation();
            e.preventDefault();
            e.returnValue = false;
            handler(this);
        }, false);

        return this;
    }

    /**
     * Select an element
     * @param selector Selector
     * @return Element
     */
    element(...selector: string[]): UIElement {
        let element: HTMLElement = this.selectNativeElement<HTMLElement>(...selector);
        if (element) {
            return UIElement.fromNativeElement(element);
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
        let element: E = <E> this.nativeElement.querySelector(selectorString);
        return element;
    }

    /**
     * Select multiple elements
     * @param selector Select
     * @return Elements
     */
    elements(...selector: string[]): UIElement[] {
        let elements: UIElement[] = [];
        this.selectNativeElements<HTMLElement>(...selector).forEach(e => elements.push(UIElement.fromNativeElement(e)));
        return elements;
    }

    /**
     * Select multiple native elements
     * @param selectorParts Selector parts
     * @return Native elements
     */
    selectNativeElements<E extends Element>(...selectorParts: string[]): NodeListOf<E> {
        let selectorString: string = this.buildQuerySelector(...selectorParts);
        let elements: NodeListOf<E> = <NodeListOf<E>> this.nativeElement.querySelectorAll(selectorString);
        return elements;
    }

    /**
     * Iterate over elements
     * @param callback Callback
     * @param selector Selector
     */
    forEachElement(callback: (element: UIElement) => void, ...selector: string[]): void {
        this.forEachNativeElement<HTMLElement>(e => callback(UIElement.fromNativeElement(e)), ...selector);
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
        targetElement.getChildTarget().getNativeElement().appendChild(this.nativeElement);
        return this;
    }

    /**
     * Detach the element from its parent container
     * @return this
     */
    detach(): UIElement {
        if (this.nativeElement.parentNode) {
            this.nativeElement.parentNode.removeChild(this.nativeElement);
        }

        return this;
    }

    /**
     * Make the element draggable
     * @param handler Handler
     * @param <T>     Drag action data type
     * @return this
     */
    draggable<T>(handler: (dragAction: UIDragAction<T>) => void): UIElement {
        this.nativeElement.setAttribute('draggable', 'true');
        this.nativeElement.addEventListener('dragstart', e => {
            let dragAction: UIDragAction<T> = {
                type: UIDragActionType.MOVE
            };

            handler(dragAction);

            switch (dragAction.type) {
            case UIDragActionType.COPY:
                e.dataTransfer.dropEffect = 'copy';
                break;
            case UIDragActionType.LINK:
                e.dataTransfer.dropEffect = 'link';
                break;
            case UIDragActionType.MOVE:
                e.dataTransfer.dropEffect = 'move';
                break;
            default:
                throw new Error('unknown drag action type ' + dragAction.type);
            }

            console.log('drag start', e);
        });
        this.nativeElement.addEventListener('dragend', e => {
            let transferId: string = e.dataTransfer.getData('plain/text');
            //let dragData: DragData = UIElement.getAndRemoveDragData(transferId);

            console.log('dragging ended');
        });

        return this;
    }

    /**
     * Make the element a drop target
     */
    dropTarget(): UIElement {
        this.nativeElement.addEventListener('dragover', e => {
            e.preventDefault();
            console.log('drag over', e);
        }, false);

        this.nativeElement.addEventListener('drop', e => {
            console.log('dropped', e);
        }, false);

        return this;
    }

    /**
     * Clear content, i.e. all child nodes
     * @return this
     */
    clearContent(): UIElement {
        let childTarget: HTMLElement = this.getChildTarget().getNativeElement();
        let clone: HTMLElement = <HTMLElement> childTarget.cloneNode(false);
        childTarget.parentNode.replaceChild(clone, childTarget);
        return this;
    }

    /**
     * Get the element
     * @return Element
     */
    getNativeElement(): HTMLElement {
        return this.nativeElement;
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

    /**
     * Emit an event
     * @param eventType Event type
     */
    protected emitEvent(eventType: string): void {
        this.nativeElement.dispatchEvent(new Event(eventType));
    }

    /**
     * Get the child target
     * @return Child target
     */
    protected getChildTarget(): UIElement {
        return this;
    }

    /**
     * Create a UI element from a native element
     * @param nativeElement Native element
     * @return UI element
     */
    static fromNativeElement<E extends HTMLElement>(nativeElement: E): UIElement {
        let element: UIElement = new UIElement();
        element.nativeElement = nativeElement;
        return element;
    }

}

export {
    UIElement
};
