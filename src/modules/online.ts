import {Module, ModuleInformation} from './module';
import {Component} from '../component';
import {WindowManager} from '../ui/window';

/**
 * Online module
 */
@Component
class OnlineModule implements Module {
    private windowManager: WindowManager;

    /**
     * Class constructor
     * @param windowManager Window manager
     */
    constructor(windowManager: WindowManager) {
        this.windowManager = windowManager;
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
