import {ModuleInformation} from './module-information';
import {CommandManager, MenuBuilder, WindowManager} from 'ui';

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
     * @param menuBuilder Menu builder
     */
    buidMenu(menuBuilder: MenuBuilder): void {
        // Default: no menu entries added
    }

    /**
     * Register commands
     * @param commandManager Command manager
     */
    registerCommands(commandManager: CommandManager): void {
        // Default: no command registered
    }

    /**
     * Register windows
     * @param windowManager Window manager
     */
    registerWindows(windowManager: WindowManager): void {
        // Default: no window registered
    }

}

export {
    Module
};
