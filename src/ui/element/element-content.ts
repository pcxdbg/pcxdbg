import {UIElement} from './element';

/**
 * Abstract user interface element (content)
 */
interface AbstractUIElementContent extends UIElement { }
abstract class AbstractUIElementContent {

    /**
     * Set the text
     * @param text Text
     * @return this
     */
    text(text: string): UIElement {
        this.getNativeElement().innerText = text;
        return this;
    }

    /**
     * Get the text
     * @return Text
     */
    getText(): string {
        return this.getNativeElement().innerText;
    }

    /**
     * Set the content as HTML
     * @param html HTML
     * @Return this
     */
    html(html: string): UIElement {
        this.getNativeElement().innerHTML = html;
        return this;
    }

    /**
     * Clear content, i.e. all child nodes
     * @return this
     */
    clearContent(): UIElement {
        let childTarget: HTMLElement = this.getChildTarget().getNativeElement();
        while (childTarget.lastChild) {
            childTarget.removeChild(childTarget.lastChild);
        }
        // let clone: HTMLElement = <HTMLElement> childTarget.cloneNode(false);
        // childTarget.parentNode.replaceChild(clone, childTarget);
        return this;
    }

}

export {
    AbstractUIElementContent
};
