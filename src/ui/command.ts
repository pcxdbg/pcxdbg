import {Component} from '../component';

/**
 * Command handler
 * @param commandId         Command identifier
 * @param commandParameters Command parameters
 */
type CommandHandler = (commandId?: string, commandParameters?: {[parameterName: string]: any}) => void;

/**
 * Command manager
 */
@Component
class CommandManager {
    private commandHandlers: {[commandId: string]: CommandHandler} = {};

    /**
     * Class constructor
     */
    constructor() {
        window['__commandManager__'] = this;
    }

    /**
     * Execute a command
     * @param commandId         Command identifier
     * @param commandParameters Command
     */
    executeCommand(commandId: string, commandParameters?: {[parameterName: string]: any}): void {
        if (!(commandId in this.commandHandlers)) {
            console.warn('no registered handler for command ' + commandId);
        }
    }

    /**
     * Register a command handler
     * @param commandId      Command identifier
     * @param commandHandler Command handler
     * @return this
     */
    on(commandId: string, commandHandler: CommandHandler): CommandManager {
        if (commandId in this.commandHandlers) {
            throw new Error('a command handler is already registered for command ' + commandId);
        }

        return this;
    }

}

export {
    CommandHandler,
    CommandManager
};
