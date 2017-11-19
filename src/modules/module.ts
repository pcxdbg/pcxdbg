import {Menu} from '../ui/menu';

/**
 * Module information
 */
class ModuleInformation {
    name: string;
    description: string;
    version: string;
}

/**
 * Module interface
 */
abstract class Module {

    /**
     * Get the module name
     * @return Module name
     */
    abstract getInformation(): Promise<ModuleInformation>;

    /**
     * Build menu entries
     * @param menu Menu
     */
    buidMenuEntries(menu: Menu): void {
        // Default: no menu entries added
    }

}

export {
    Module,
    ModuleInformation
};
