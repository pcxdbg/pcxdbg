import {Module} from '../module';
import {ModuleInformation} from '../module-information';
import {WindowManager} from 'ui';
import {Component} from 'es-injection';

/**
 * Storage module
 */
@Component
class StorageModule extends Module {
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
        return {
            name: 'Storage',
            description: 'Storage module',
            version: null
        };
    }

}

export {
    StorageModule
};
