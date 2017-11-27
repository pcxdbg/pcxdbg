import {CommandManager, Menu, WindowManager} from 'ui';

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
     * @param parentMenu Parent menu
     */
    buidMenu(parentMenu: Menu): void {
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
    Module,
    ModuleInformation
};
