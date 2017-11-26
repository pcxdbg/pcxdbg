
/**
 * Command handler
 * @param commandParameters Command parameters
 * @param commandId         Command identifier
 */
type CommandHandler = (commandParameters?: {[parameterName: string]: any}, commandId?: string) => void;

export {
    CommandHandler
};
