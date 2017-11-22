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

}

export {
    BrowserHostBackend
};
