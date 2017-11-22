import {HostBackend} from './host';
import {Component} from '../component';
import {remote} from 'electron';

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

}

export {
    ElectronHostBackend
};
