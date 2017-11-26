import {HostBackend} from './host';
import {Component} from '../component';

/**
 * Browser host back-end
 */
@Component
class BrowserHostBackend extends HostBackend {

    /**
     * Get the application path
     * @return Application path
     */
    getApplicationPath(): string {
        return window.location.toString();
    }

    /**
     * Open an URL
     * @param url URL
     */
    openUrl(url: string): void {
        window.open(url, '_blank');
    }

}

export {
    BrowserHostBackend
};
