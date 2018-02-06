import {UIElement} from './element';

/**
 * Abstract user interface element (attributes)
 */
interface AbstractUIElementAttr extends UIElement { }
abstract class AbstractUIElementAttr {

    /**
     * Test whether an attribute is set
     * @param attributeName Attribute name
     */
    hasAttribute(attributeName: string): boolean {
        return this.getNativeElement().hasAttribute(attributeName);
    }

    /**
     * Set an attribute
     * @param attributeName  Attribute name
     * @param attributeValue Attribute value
     * @return this
     */
    attribute(attributeName: string, attributeValue?: string): UIElement {
        this.getNativeElement().setAttribute(attributeName, attributeValue || '');
        return this;
    }

    /**
     * Remove an attribute
     * @param attributeName Attribute name
     * @return this
     */
    removeAttribute(attributeName: string): UIElement {
        this.getNativeElement().removeAttribute(attributeName);
        return this;
    }

    /**
     * Toggle an attribute, setting it if not set and removing it otherwise
     * @param attributeName Attribute name
     * @return this
     */
    toggleAttribute(attributeName: string, attributeValue?: string): UIElement {
        if (this.hasAttribute(attributeName)) {
            this.removeAttribute(attributeName);
        } else {
            this.attribute(attributeName, attributeValue);
        }

        return this;
    }

    /**
     * Get an attribute value
     * @param attributeName Attribute name
     * @return Attribute value
     */
    getAttributeValue(attributeName: string): string {
        return this.getNativeElement().getAttribute(attributeName);
    }

}

export {
    AbstractUIElementAttr
};
