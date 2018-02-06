import {UIDragAction} from './drag-action';

/**
 * User interface element
 */
interface UIElement {

    /**
     * Get the element
     * @return Element
     */
    getNativeElement(): HTMLElement;

    /**
     * Attach an element
     * @param element Element to attach
     * @return this
     */
    attach(element: UIElement): UIElement;

    /**
     * Attach the element to a target
     * @param targetElement Target element
     * @return this
     */
    attachTo(targetElement: UIElement): UIElement;

    /**
     * Detach the element from its parent container
     * @return this
     */
    detach(): UIElement;

    /**
     * Get the child target
     * @return Child target
     */
    getChildTarget(): UIElement;

    /**
     * Select an element
     * @param selector Selector
     * @return Element
     */
    element(...selector: string[]): UIElement;

    /**
     * Select a native element
     * @param selectorParts Selector parts
     * @return Native element
     */
    selectNativeElement<E extends Element>(...selectorParts: string[]): E;

    /**
     * Select multiple elements
     * @param selector Select
     * @return Elements
     */
    elements(...selector: string[]): UIElement[];

    /**
     * Select multiple native elements
     * @param selectorParts Selector parts
     * @return Native elements
     */
    selectNativeElements<E extends Element>(...selectorParts: string[]): NodeListOf<E>;

    /**
     * Iterate over elements
     * @param callback Callback
     * @param selector Selector
     */
    forEachElement(callback: (element: UIElement) => void, ...selector: string[]): void;

    /**
     * Iterate over native elements
     * @param callback Callback
     * @param selector Selector
     */
    forEachNativeElement<E extends Element>(callback: (element: E) => void, ...selector: string[]): void;

    /**
     * Set the text
     * @param text Text
     * @return this
     */
    text(text: string): UIElement;

    /**
     * Get the text
     * @return Text
     */
    getText(): string;

    /**
     * Set the content as HTML
     * @param html HTML
     * @Return this
     */
    html(html: string): UIElement;

    /**
     * Clear content, i.e. all child nodes
     * @return this
     */
    clearContent(): UIElement;

    /**
     * Test whether an attribute is set
     * @param attributeName Attribute name
     */
    hasAttribute(attributeName: string): boolean;

    /**
     * Set an attribute
     * @param attributeName  Attribute name
     * @param attributeValue Attribute value
     * @return this
     */
    attribute(attributeName: string, attributeValue?: string): UIElement;

    /**
     * Remove an attribute
     * @param attributeName Attribute name
     * @return this
     */
    removeAttribute(attributeName: string): UIElement;

    /**
     * Toggle an attribute, setting it if not set and removing it otherwise
     * @param attributeName Attribute name
     * @return this
     */
    toggleAttribute(attributeName: string, attributeValue?: string): UIElement;

    /**
     * Get an attribute value
     * @param attributeName Attribute name
     * @return Attribute value
     */
    getAttributeValue(attributeName: string): string;

    /**
     * Set or get the class name(s)
     * @param classNames Class names
     * @return Class names
     */
    class(...classNames: string[]): string;

    /**
     * Get the class names
     * @return Class names
     */
    classes(): string[];

    /**
     * Register an even handler
     * @param eventType Event type
     * @param handler   Handler
     * @return this
     */
    on(eventType: string, handler: (element: UIElement) => void): UIElement;

    /**
     * Register a click handler or call click handlers
     * @param handler Click handler
     * @return this
     */
    click(handler?: (e: MouseEvent) => void): UIElement;

    /**
     * Register a mouse enter handler
     * @param handler Mouse enter handler
     * @return this
     */
    mouseEnter(handler: (e?: MouseEvent) => void): UIElement;

    /**
     * Register a mouse down handler
     * @param handler Mouse down handler
     * @return this
     */
    mouseDown(handler: (e?: MouseEvent) => void): UIElement;

    /**
     * Emit an event
     * @param eventType Event type
     */
    emitEvent(eventType: string): void;

    /**
     * Give focus to the element
     * @return this
     */
    focus(): UIElement;

    /**
     * Make the element draggable
     * @param handler Handler
     * @param <T>     Drag action data type
     * @return this
     */
    draggable<T>(handler: (dragAction: UIDragAction<T>) => void): UIElement;

    /**
     * Make the element a drop target
     * @return this
     */
    dropTarget(): UIElement;

    /**
     * Set the i18n properties for the element
     * @param key        Key
     * @param parameters Optional parameters
     * @param options    Options
     * @return this
     */
    i18n(key?: string, parameters?: {[parameterName: string]: any}, ...options: string[]): UIElement;

    /**
     * Apply translations to the element and all its descendants
     * @return this
     */
    applyTranslations(): UIElement;

}

export {
    UIElement
};
