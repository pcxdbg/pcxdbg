import {HostBackend} from './host';
import {Component} from '../component';
import {remote, shell} from 'electron';

/**
 * Electron host backend
 */
@Component
class ElectronHostBackend extends HostBackend {

    /**
     * Get the application path
     * @return Application path
     */
    getApplicationPath(): string {
        return remote.app.getAppPath();
    }

    /**
     * Open an URL
     * @param url URL
     */
    openUrl(url: string): void {
        shell.openExternal(url);
    }

}

export {
    ElectronHostBackend
};
