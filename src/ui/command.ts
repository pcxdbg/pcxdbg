import {Component} from '../component';
import {AcceleratorManager} from './accelerator';

/**
 * Command handler
 * @param commandId         Command identifier
 * @param commandParameters Command parameters
 */
type CommandHandler = (commandId?: string, commandParameters?: {[parameterName: string]: any}) => void;

/**
 * Command alias definition
 */
interface CommandAliasDefinition {
    command: string;
    parameters?: {[parameterName: string]: any};
}

/**
 * Command definition
 */
interface CommandDefinition {
    id: string;
    accelerator?: string;
    label?: string;
    labelParameters?: {[parameterName: string]: any};
    description?: string;
    descriptionParameters?: {[parameterName: string]: any};
    aliasFor?: CommandAliasDefinition;
}

/**
 * Command
 */
class Command {
    definition: CommandDefinition;
    handler: CommandHandler;
}

/**
 * Command manager
 */
@Component
class CommandManager {
    private commands: {[commandId: string]: Command} = {};
    private acceleratorManager: AcceleratorManager;

    /**
     * Set the accelerator manager
     * @param acceleratorManager Accelerator manager
     */
    @Component
    setAcceleratorManager(acceleratorManager: AcceleratorManager): void {
        this.acceleratorManager = acceleratorManager;
    }

    /**
     * Register a command
     * @param commandDefinition Command definition
     */
    registerCommand(commandDefinition: CommandDefinition): void {
        if (commandDefinition.id in this.commands) {
            throw new Error('command ' + commandDefinition.id + ' is already registered');
        }

        this.commands[commandDefinition.id] = {
            definition: commandDefinition,
            handler: null
        };

        if (commandDefinition.accelerator) {
            this.acceleratorManager.registerAccelerator(commandDefinition.accelerator, commandDefinition.id);
        }
    }

    /**
     * Execute a command
     * @param commandId         Command identifier
     * @param commandParameters Command
     */
    executeCommand(commandId: string, commandParameters?: {[parameterName: string]: any}): void {
        let command: Command = this.getCommand(commandId);
        let commandAlias: CommandAliasDefinition;

        commandAlias = command.definition.aliasFor;
        if (commandAlias) {
            this.executeCommand(commandAlias.command, commandAlias.parameters);
        } else if (command.handler) {
            command.handler(commandId, commandParameters);
        } else {
            console.warn('no registered handler for command ' + commandId + ' with parameters:', commandParameters);
        }
    }

    /**
     * Get a command definition
     * @param commandId Command identifier
     * @return Command definition
     */
    getCommandDefinition(commandId: string): CommandDefinition {
        let command: Command = this.commands[commandId];
        return command && command.definition;
    }

    /**
     * Register a command handler
     * @param commandId      Command identifier
     * @param commandHandler Command handler
     * @return this
     */
    on(commandId: string, commandHandler: CommandHandler): CommandManager {
        let command: Command = this.getCommand(commandId);
        if (command.handler) {
            throw new Error('a command handler is already registered for command ' + commandId);
        }

        command.handler = commandHandler;

        return this;
    }

    /**
     * Get a command from its identifier
     * @param commandId Command identifier
     * @return Command
     */
    private getCommand(commandId): Command {
        if (!(commandId in this.commands)) {
            throw new Error('unknown command ' + commandId);
        }

        return this.commands[commandId];
    }

}

export {
    CommandAliasDefinition,
    CommandDefinition,
    CommandHandler,
    CommandManager
};
