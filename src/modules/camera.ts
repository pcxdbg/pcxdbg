import {Module, ModuleInformation} from './module';
import {Component} from '../component';
import {WindowManager} from '../ui/window';

/**
 * Camera module
 */
@Component
class CameraModule implements Module {

    /**
     * Class constructor
     * @param windowManager Window manager
     */
    constructor(windowManager: WindowManager) {

    }

    /**
     * Get the module name
     * @return Module name
     */
    async getInformation(): Promise<ModuleInformation> {
        let moduleInformation: ModuleInformation = {
            name: 'Camera',
            description: 'Camera module',
            version: null
        };
        return moduleInformation;
    }

}

export {
    CameraModule
};
