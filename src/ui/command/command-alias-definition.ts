
/**
 * Command alias definition
 */
interface CommandAliasDefinition {
    command: string;
    parameters?: {[parameterName: string]: any};
}

export {
    CommandAliasDefinition
};
