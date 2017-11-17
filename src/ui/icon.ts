import {UIElement} from './element';
import {Component} from '../component';
import {HttpManager, HttpRequest, HttpResponse} from '../net/http';

type DataCache = {[url: string]: string};
type LoadingCache = {[url: string]: Promise<string>};

/**
 * Icon manager
 */
@Component
class IconManager {
    private static PATH_IMAGES: string = 'images/';
    private static CONTENTTYPE_SVG: string = 'image/svg';
    private static EXTENSION_SVG: string = '.svg';

    private dataCache: DataCache = {};
    private loadingCache: LoadingCache = {};
    private httpManager: HttpManager;

    /**
     * Class constructor
     * @param httpManager HTTP manager
     */
    constructor(httpManager: HttpManager) {
        this.httpManager = httpManager;
    }

    /**
     * Create the icon
     * @param width  Icon width
     * @param height Icon height
     * @param name   Icon name
     */
    createIcon(width: number, height: number, name: string): Icon {
        let icon: Icon = new Icon(this, width, height);
        this.setIconData(icon, name);
        return icon;
    }

    /**
     * Set the icon data
     * @param icon Icon
     * @param name Icon name
     */
    private setIconData(icon: Icon, name: string): void {
        if (name in this.dataCache) {
            icon.setData(this.dataCache[name]);
        } else {
            this.loadIconData(name).then(imageData => icon.setData(imageData));
        }
    }

    /**
     * Load icon data
     * @param name Icon name
     * @return Promise that resolves to the icon data
     */
    private loadIconData(name: string): Promise<string> {
        if (name in this.loadingCache) {
            return this.loadingCache[name];
        }

        let promise: Promise<string> = this.loadingCache[name] = new Promise((resolve, reject) => {
            let httpRequest: HttpRequest<void> = {
                method: 'GET',
                url: IconManager.PATH_IMAGES + name + IconManager.EXTENSION_SVG,
                headers: {
                    accept: IconManager.CONTENTTYPE_SVG
                }
            };

            this.httpManager.executeHttpRequest<void, string>(httpRequest).then(httpResponse => resolve(httpResponse.data));
        });

        return promise;
    }

}

/**
 * Icon implementation
 */
class Icon extends UIElement {
    private iconManager: IconManager;
    private width: number;
    private height: number;
    private src: string;

    /**
     * Class constructor
     * @param iconManager Icon manager
     * @param iconWidth   Icon width
     * @param iconHeight  Icon height
     */
    constructor(iconManager: IconManager, iconWidth: number, iconHeight: number) {
        super('icon');
        let nativeElement: HTMLElement;

        this.iconManager = iconManager;
        this.width = iconWidth;
        this.height = iconHeight;

        nativeElement = this.getNativeElement();
        nativeElement.style.width = iconWidth + 'px';
        nativeElement.style.height = iconHeight + 'px';
    }

    /**
     * Get the icon width
     * @return Icon width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Get the icon height
     * @return Icon height
     */
    getHeight(): number {
        return this.height;
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
        this.i18n().attribute('title', labelText);
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
    Icon,
    IconManager
};
