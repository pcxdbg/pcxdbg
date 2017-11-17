import {Module, ModuleInformation} from './module';
import {Component} from '../component';
import {WindowManager} from '../ui/window';

/**
 * GPU module
 */
@Component
class GpuModule implements Module {

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
            name: 'GPU',
            description: 'GPU module',
            version: null
        };
    }

}

export {
    GpuModule
};
