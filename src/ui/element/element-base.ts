import {AbstractUIElementAttr} from './element-attr';
import {AbstractUIElementClass} from './element-class';
import {AbstractUIElementContent} from './element-content';
import {AbstractUIElementDOM} from './element-dom';
import {AbstractUIElementDrag} from './element-drag';
import {AbstractUIElementEvent} from './element-event';
import {AbstractUIElementFocus} from './element-focus';
import {AbstractUIElementI18n} from './element-i18n';
import {AbstractUIElementQuery} from './element-query';
import {UIDragAction} from './drag-action';
import {UIElement} from './element';

/**
 * Base user interface element
 */
class UIElementBase implements UIElement {
    private nativeElement: HTMLElement;

    /**
     * Class constructor
     * @param tagName   Tag name
     * @param innerHTML Inner HTML
     */
    constructor(tagName?: string|HTMLElement, innerHTML?: string) {
        if (tagName) {
            if (typeof(tagName) === 'string') {
                this.nativeElement = document.createElement(tagName);

                if (innerHTML) {
                    this.nativeElement.innerHTML = innerHTML;
                }
            } else {
                this.nativeElement = tagName;
            }
        }
    }

    /**
     * Get the element
     * @return Element
     */
    getNativeElement(): HTMLElement {
        return this.nativeElement;
    }

    // DOM
    attach: (element: UIElement) => UIElement;
    attachTo: (targetElement: UIElement) => UIElement;
    detach: () => UIElement;
    getChildTarget: () => UIElement;
    // query
    element: (...selector: string[]) => UIElement;
    selectNativeElement: <E extends Element>(...selectorParts: string[]) => E;
    elements: (...selector: string[]) => UIElement[];
    selectNativeElements: <E extends Element>(...selectorParts: string[]) => NodeListOf<E>;
    forEachElement: (callback: (element: UIElement) => void, ...selector: string[]) => void;
    forEachNativeElement: <E extends Element>(callback: (element: E) => void, ...selector: string[]) => void;
    // content
    text: (text: string) => UIElement;
    getText: () => string;
    html: (html: string) => UIElement;
    clearContent: () => UIElement;
    // attr
    hasAttribute: (attributeName: string) => boolean;
    attribute: (attributeName: string, attributeValue?: string) => UIElement;
    removeAttribute: (attributeName: string) => UIElement;
    toggleAttribute: (attributeName: string, attributeValue?: string) => UIElement;
    getAttributeValue: (attributeName: string) => string;
    // class
    class: (...classNames: string[]) => string;
    classes: () => string[];
    // event
    on: (eventType: string, handler: (element: UIElement) => void) => UIElement;
    click: (handler: (e?: MouseEvent) => void) => UIElement;
    mouseEnter: (handler: (e?: MouseEvent) => void) => UIElement;
    mouseDown: (handler: (e?: MouseEvent) => void) => UIElement;
    emitEvent: (eventType: string) => UIElement;
    // focus
    focus: () => UIElement;
    // drag
    draggable: <T>(handler: (dragAction: UIDragAction<T>) => void) => UIElement;
    dropTarget: () => UIElement;
    // i18n
    i18n: (key?: string, parameters?: {[parameterName: string]: any}, ...options: string[]) => UIElement;
    applyTranslations: () => UIElement;

}

/**
 * Apply mixins to a base type
 * @param baseType      Base type
 * @param abstractTypes List of abstract implementations
 */
function applyMixins(baseType: Function, ...abstractTypes: Function[]) {
    abstractTypes.forEach(abstractType => {
        Object.getOwnPropertyNames(abstractType.prototype).forEach(propertyName => {
            baseType.prototype[propertyName] = abstractType.prototype[propertyName];
        });
    });
}

applyMixins(
    UIElementBase,
    AbstractUIElementAttr,
    AbstractUIElementClass,
    AbstractUIElementContent,
    AbstractUIElementDOM,
    AbstractUIElementDrag,
    AbstractUIElementEvent,
    AbstractUIElementFocus,
    AbstractUIElementI18n,
    AbstractUIElementQuery
);

export {
    UIElementBase
};
