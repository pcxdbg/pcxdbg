import {Icon} from './icon';
import {HttpManager, HttpRequest, HttpResponse} from 'network';
import {ApplicationContext, Component, Inject} from 'es-injection';

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

    private applicationContext: ApplicationContext;
    private dataCache: DataCache = {};
    private loadingCache: LoadingCache = {};
    private httpManager: HttpManager;

    /**
     * Set the application context
     * @param applicationContext Application context
     */
    @Inject
    setApplicationContext(applicationContext: ApplicationContext): void {
        this.applicationContext = applicationContext;
    }

    /**
     * Set the HTTP manager
     * @param httpManager HTTP manager
     */
    @Inject
    setHttpManager(httpManager: HttpManager): void {
        this.httpManager = httpManager;
    }

    /**
     * Create the icon
     * @param width  Icon width
     * @param height Icon height
     * @param name   Icon name
     */
    createIcon(width: number, height: number, name: string): Icon {
        let icon: Icon = this.applicationContext.getComponent(Icon);
        icon.setWidth(width);
        icon.setHeight(height);
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

export {
    IconManager
};
