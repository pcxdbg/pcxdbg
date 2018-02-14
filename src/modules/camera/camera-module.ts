import {Module} from '../module';
import {ModuleInformation} from '../module-information';
import {WindowManager} from 'ui';
import {Component} from 'es-injection';

/**
 * Camera module
 */
@Component
class CameraModule extends Module {
    private windowManager: WindowManager;

    /**
     * Class constructor
     * @param windowManager Window manager
     */
    constructor(windowManager: WindowManager) {
        super();
        this.windowManager = windowManager;
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
