import {UIElement} from './element';

/**
 * Abstract user interface element (class)
 */
interface AbstractUIElementClass extends UIElement { }
abstract class AbstractUIElementClass {

    /**
     * Set or get the class name(s)
     * @param classNames Class names
     * @return Class names
     */
    class(...classNames: string[]): string {
        let nativeElement: HTMLElement = this.getNativeElement();

        if (classNames.length > 0) {
            nativeElement.className = classNames.join(' ');
        }

        return nativeElement.className;
    }

    /**
     * Get the class names
     * @return Class names
     */
    classes(): string[] {
        return this.getNativeElement().className.split(' ');
    }

}

export {
    AbstractUIElementClass
};
