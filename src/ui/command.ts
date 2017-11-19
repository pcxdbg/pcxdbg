import {Component} from '../component';
import {AcceleratorManager} from './accelerator';

/**
 * Command handler
 * @param commandId Command identifier
 */
type CommandHandler = (commandId?: string) => void;

/**
 * Command manager
 */
@Component
class CommandManager {
    private commandAccelerators: {[commandId: string]: string} = {};
    private acceleratorManager: AcceleratorManager;

    /**
     * Class constructor
     * @param acceleratorManager Accelerator manager
     */
    constructor(acceleratorManager: AcceleratorManager) {
        this.acceleratorManager = acceleratorManager;
    }

    /**
     * Get the registered accelerator for a command, or register and get a default value to otherwise
     * @param commandId          Command identifier
     * @param defaultAccelerator Default accelerator
     * @return Registered accelerator
     */
    getAccelerator(commandId: string, defaultAccelerator?: string, commandHandler?: CommandHandler): string {
        if (commandId in this.commandAccelerators) {
            return this.commandAccelerators[commandId];
        } else if (defaultAccelerator) {
            this.acceleratorManager.registerAccelerator(defaultAccelerator, () => commandHandler(commandId));
            return this.commandAccelerators[commandId] = defaultAccelerator;
        }

        return undefined;
    }

}

export {
    CommandHandler,
    CommandManager
};
