import {Module, ModuleInformation} from '../module';
import {Component} from '../../component';
import {WindowManager} from '../../ui';

/**
 * APU module
 */
@Component
class ApuModule extends Module {
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
            name: 'APU',
            description: 'APU module',
            version: null
        };
    }

}

export {
    ApuModule
};
