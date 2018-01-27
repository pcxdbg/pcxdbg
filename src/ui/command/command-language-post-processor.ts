import {CommandDefinition} from './command-definition';
import {CommandManager} from './command-manager';
import {Component, Inject} from 'injection';
import {LanguagePostProcessor} from 'i18n';

/**
 * Command language post-processor
 */
@Component
class CommandLanguagePostProcessor extends LanguagePostProcessor {
    private static REGEXP_CMDACC: RegExp = /\$cmdacc\(([^\)]+)\)/g;

    private commandManager: CommandManager;

    /**
     * Class constructor
     */
    constructor() {
        super('ui-command');
    }

    @Inject
    setCommandManager(commandManager: CommandManager): void {
        this.commandManager = commandManager;
    }

    /**
     * Post-process an i18n value
     * @param value   Translation value
     * @param key     Translation key
     * @param options Options 
     * @return Processed value
     */
    postProcess(value: string, key?: string, options?: {}): string {
        return value.replace(CommandLanguagePostProcessor.REGEXP_CMDACC, (substring, commandId) => this.getCommandIdAccelerator(commandId));
    }

    /**
     * Get an accelerator from a command identifier
     * @param commandId Command identifier
     */
    private getCommandIdAccelerator(commandId: string): string {
        let commandDefinition: CommandDefinition = this.commandManager.getCommandDefinition(commandId);
        if (commandDefinition) {
            return commandDefinition.accelerator;
        }

        return 'cmdacc-invalidid(' + commandId + ')';
    }

}

export {
    CommandLanguagePostProcessor
};
