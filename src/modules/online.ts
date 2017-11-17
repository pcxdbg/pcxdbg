import {Module, ModuleInformation} from './module';
import {Component} from '../component';
import {WindowManager} from '../ui/window';

/**
 * Online module
 */
@Component
class OnlineModule implements Module {

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
        return {
            name: 'Online',
            description: 'Online module',
            version: null
        };
    }

}

export {
    OnlineModule
};
