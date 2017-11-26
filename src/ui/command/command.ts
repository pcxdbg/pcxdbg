import {CommandDefinition} from './command-definition';
import {CommandHandler} from './command-handler';

/**
 * Command
 */
interface Command {
    definition?: CommandDefinition;
    handler?: CommandHandler;
}

export {
    Command
};
