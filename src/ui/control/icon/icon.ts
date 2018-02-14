import {UIElementBase} from '../../element';
import {Component, Scope, ScopeType} from 'es-injection';

/**
 * Icon implementation
 */
@Component
@Scope(ScopeType.PROTOTYPE)
class Icon extends UIElementBase {
    private width: number;
    private height: number;
    private src: string;

    /**
     * Class constructor
     */
    constructor() {
        super('icon');
    }

    /**
     * Get the icon width
     * @return Icon width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Set the icon width
     * @param iconWidth Icon width
     */
    setWidth(iconWidth: number): void {
        this.width = iconWidth;
        this.getNativeElement().style.width = iconWidth + 'px';
    }

    /**
     * Get the icon height
     * @return Icon height
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Set the icon height
     * @param iconHeight Icon height
     */
    setHeight(iconHeight: number): void {
        this.height = iconHeight;
        this.getNativeElement().style.height = iconHeight + 'px';
    }

    /**
     * Set the icon label
     * @param label           Label identifier
     * @param labelParameters Label parameters
     */
    setLabel(label: string, labelParameters?: {[parameterName: string]: any}): void {
        this.i18n(label, labelParameters, 'title').applyTranslations();
    }

    /**
     * Set the icon label
     * @param labelText Label text
     */
    setLabelText(labelText: string): void {
        this.i18n();
        this.attribute('title', labelText);
    }

    /**
     * Set the icon image from SVG
     * @param imageData Image data
     */
    setData(imageData: string): void {
        let svgElement: SVGElement;

        this.html(imageData);
        svgElement = this.selectNativeElement<SVGElement>('svg');
        svgElement.setAttribute('width', '' + this.width);
        svgElement.setAttribute('height', '' + this.height);
    }

    /**
     * Callback triggered when an image has been loaded
     * @param imageElement Image element
     */
    private onImageLoaded(imageElement: Element): void {
        this.getNativeElement().appendChild(imageElement.cloneNode(true)); // TODO: avoid the cloning?
    }

    /**
     * Override the SVG element's dimensions
     */
    /* private overrideDimensions() {
        let div: HTMLDivElement = <HTMLDivElement> this.element.querySelector('div');
        let svg: SVGElement = <SVGElement> this.element.querySelector('svg');
        let width: string = this.width || this.element.style.width;
        let height: string = this.height || this.element.style.height;
        let n: number;

        n = width.indexOf('px');
        if (n !== -1) {
            width = width.substr(0, n);
        }

        n = height.indexOf('px');
        if (n !== -1) {
            height = height.substr(0, n);
        }

        if (width) {
            div.style.width = this.element.style.width = this.width + 'px';
            svg.setAttribute('width', this.width);
        }

        if (height) {
            div.style.height = this.element.style.height = this.height + 'px';
            svg.setAttribute('height', this.height);
        }
    } */

}

export {
    Icon
};
