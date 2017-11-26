import {CommandAliasDefinition} from './command-alias-definition';

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

export {
    CommandDefinition
};
